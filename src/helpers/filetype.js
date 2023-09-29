import path from "path";

export function getFileType(fileName) {
  const ext = path.extname(fileName).toLowerCase();

  const textExtensions = [".txt", ".csv", ".json", ".xml"];
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  const videoExtensions = [".mp4", ".avi", ".mov", ".mkv"];

  if (textExtensions.includes(ext)) {
    return "text";
  } else if (imageExtensions.includes(ext)) {
    return "image";
  } else if (videoExtensions.includes(ext)) {
    return "video";
  } else {
    return "Unknown file type";
  }
}
