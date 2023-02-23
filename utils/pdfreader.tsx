import { getDocument } from "pdfjs-dist";

export default async function pdfText(pdfPath) {
  const text = [];
  try {
    // Load the PDF file asynchronously
    const doc = await getDocument(pdfPath).promise;
    const numPages = doc.numPages;

    let lastPromise; // will be used to chain promises
    lastPromise = doc.getMetadata().then(function (data) {
      // You can do something with the metadata here
    });

    const loadPage = async function (pageNum) {
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      const content = await page.getTextContent();

      // Content contains lots of information about the text layout and
      // styles, but we need only strings at the moment
      const strings = content.items.map(function (item) {
        return item.str;
      });

      text.push(strings.join(" "));

      // Release page resources.
      page.cleanup();
    };

    // Loading of the first page will wait on metadata and subsequent loadings
    // will wait on the previous pages.
    for (let i = 1; i <= numPages; i++) {
      lastPromise = lastPromise.then(() => loadPage(i));
    }

    await lastPromise;
    console.log("# End of Document");
  } catch (error) {
    console.error("Error:", error);
  }
  return text;
}
