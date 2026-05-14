export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  const day = date.getDate();
  const months = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day} de ${month} de ${year}, ${hours}:${minutes}`;
};
