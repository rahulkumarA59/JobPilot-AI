package com.jobpilotai.backend.resumeparser.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFParagraph;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Resume text extraction service.
 * Supports PDF and DOCX formats.
 * Handles text normalization and section splitting.
 */
@Service
public class ResumeTextExtractor {

    private static final Logger log = LoggerFactory.getLogger(ResumeTextExtractor.class);

    private static final Pattern WHITESPACE_PATTERN = Pattern.compile("\\s+");
    private static final Pattern HEADERS_FOOTERS_PATTERN = Pattern.compile(
            "(?i)^(header|footer|page \\d+|----|-{3,}|===|page break).*?$",
            Pattern.MULTILINE
    );

    /**
     * Extract text from uploaded file (PDF or DOCX)
     *
     * @param file Uploaded resume file
     * @return Raw extracted text
     */
    public String extractText(MultipartFile file) throws IOException {
        String contentType = file.getContentType();

        if (contentType != null && contentType.contains("pdf")) {
            return extractFromPdf(file);
        } else if (contentType != null && 
                   (contentType.contains("word") || contentType.contains("officedocument"))) {
            return extractFromDocx(file);
        } else {
            throw new IllegalArgumentException("Unsupported file format: " + contentType);
        }
    }

    /**
     * Extract text from PDF file
     */
    private String extractFromPdf(MultipartFile file) throws IOException {
        byte[] pdfBytes = file.getBytes();
        try (PDDocument document = PDDocument.load(pdfBytes)) {
            PDFTextStripper stripper = new PDFTextStripper();
            String text = stripper.getText(document);
            log.info("Extracted {} characters from PDF", text.length());
            return text;
        } catch (IOException e) {
            log.error("Failed to extract text from PDF", e);
            throw e;
        }
    }

    /**
     * Extract text from DOCX file
     */
    private String extractFromDocx(MultipartFile file) throws IOException {
        StringBuilder text = new StringBuilder();
        try (XWPFDocument document = new XWPFDocument(file.getInputStream())) {
            for (XWPFParagraph paragraph : document.getParagraphs()) {
                String para = paragraph.getText();
                if (!para.isBlank()) {
                    text.append(para).append("\n");
                }
            }
        }
        log.info("Extracted {} characters from DOCX", text.length());
        return text.toString();
    }

    /**
     * Normalize extracted text
     * - Remove extra whitespace
     * - Remove headers/footers
     * - Normalize line endings
     */
    public String normalizeText(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return "";
        }

        // Remove common headers and footers
        String text = HEADERS_FOOTERS_PATTERN.matcher(rawText).replaceAll("");

        // Normalize whitespace (multiple spaces/tabs to single space)
        text = WHITESPACE_PATTERN.matcher(text).replaceAll(" ");

        // Clean up line breaks
        text = text.replaceAll("\r\n", "\n").replaceAll("\n{3,}", "\n\n");

        return text.trim();
    }

    /**
     * Split resume into logical sections
     * Based on common resume section headers
     */
    public List<String> splitIntoSections(String normalizedText) {
        List<String> sections = new ArrayList<>();

        String[] sectionHeaders = {
                "(?i)^\\s*(summary|objective|professional summary|executive summary)\\s*:?",
                "(?i)^\\s*(skills|technical skills|core competencies)\\s*:?",
                "(?i)^\\s*(experience|work experience|professional experience|employment)\\s*:?",
                "(?i)^\\s*(projects|portfolio|projects & achievements)\\s*:?",
                "(?i)^\\s*(education|academic|qualifications)\\s*:?",
                "(?i)^\\s*(certifications|licenses|certifications & awards)\\s*:?",
                "(?i)^\\s*(achievements|awards|accomplishments)\\s*:?",
                "(?i)^\\s*(languages|language proficiency)\\s*:?"
        };

        // Split by section headers
        String[] lines = normalizedText.split("\n");
        StringBuilder currentSection = new StringBuilder();

        for (String line : lines) {
            currentSection.append(line).append("\n");

            // Check if this line is a section header
            for (String headerPattern : sectionHeaders) {
                if (line.matches(headerPattern)) {
                    if (currentSection.length() > line.length() + 10) {
                        sections.add(currentSection.substring(0, 
                                currentSection.length() - line.length() - 1));
                        currentSection = new StringBuilder(line + "\n");
                    }
                    break;
                }
            }
        }

        if (currentSection.length() > 0) {
            sections.add(currentSection.toString());
        }

        log.info("Split resume into {} sections", sections.size());
        return sections;
    }
}
