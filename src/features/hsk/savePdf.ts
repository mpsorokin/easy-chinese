// Browser side of the worksheet: saves the PDF bytes as a downloaded file.
let lastUrl: string | undefined;

export function savePdf(bytes: Uint8Array, fileName: string) {
  // The previous file has been read long ago; keep only the latest blob alive.
  if (lastUrl) URL.revokeObjectURL(lastUrl);
  lastUrl = URL.createObjectURL(
    new Blob([bytes as BlobPart], { type: 'application/pdf' }),
  );
  const a = document.createElement('a');
  a.href = lastUrl;
  a.download = `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
