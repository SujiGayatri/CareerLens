import { PDFParse } from "pdf-parse";

const parseResumePDF = async (pdfBuffer) => {
  let parser;

  try {
    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("No PDF data received.");
    }

    parser = new PDFParse({
      data: pdfBuffer,
    });

    const result = await parser.getText();

    const extractedText = result.text?.trim();

    if (!extractedText) {
      throw new Error("No readable text was found in the PDF.");
    }

    return extractedText;
  } catch (error) {
    console.error("PDF parsing error:", error.message);

    if (error.message === "No readable text was found in the PDF.") {
      throw error;
    }

    throw new Error("Failed to extract text from the PDF.");
  } finally {
    if (parser) {
      await parser.destroy();
    }
  }
};

export default parseResumePDF;