export interface Document {
  uid?: string,
  name: string,
  description: string,
  category: string,
  downloadLink: string,
  header: string,
  documentFormat: string, // vertical u horizontal
  bannerImg: File,
  xlsxFile: File,
  design: string, // JSON del diseño
  showContactInfo: boolean
  clientId: string,
  createdBy: string,
  [key: string]: any
}
