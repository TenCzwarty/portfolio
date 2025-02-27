type Type = {
  url: string;
  filename: string;
};

export const triggerDownload = ({ url, filename }: Type) => {
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};
