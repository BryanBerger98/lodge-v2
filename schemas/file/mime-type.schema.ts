import { z } from 'zod';

export enum ImageMimeType {
	AVIF = 'image/avif',
	BMP = 'image/bmp',
	GIF = 'image/gif',
	ICO = 'image/vnd.microsoft.icon',
	JPEG = 'image/jpeg',
	PNG = 'image/png',
	SVG = 'image/svg+xml',
	TIFF = 'image/tiff',
	WEBP = 'image/webp',
};

export enum TextMimeType {
	CSV = 'text/csv',
	CSS = 'text/css',
	HTML = 'text/html',
	ICS = 'text/calendar',
	JS = 'text/javascript',
	PLAIN = 'text/plain',
};

export enum DocumentMimeType {
	'7z' = 'application/x-7z-compressed',
	ABW = 'application/x-abiword',
	ARC = 'application/x-freearc',
	AZW = 'application/vnd.amazon.ebook',
	BIN = 'application/octet-stream',
	BZ = 'application/x-bzip',
	BZ2 = 'application/x-bzip2',
	CDA = 'application/x-cdf',
	CSH = 'application/x-csh',
	DOC = 'application/msword',
	DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	EOT = 'application/vnd.ms-fontobject',
	EPUB = 'application/epub+zip',
	GZIP = 'application/gzip',
	JAR = 'application/java-archive',
	JSON = 'application/json',
	JSONLD = 'application/ld+json',
	MPKG = 'application/vnd.apple.installer+xml',
	ODP = 'application/vnd.oasis.opendocument.presentation',
	ODS = 'application/vnd.oasis.opendocument.spreadsheet',
	ODT = 'application/vnd.oasis.opendocument.text',
	OGX = 'application/ogg',
	PDF = 'application/pdf',
	PHP = 'application/x-httpd-php',
	PPT = 'application/vnd.ms-powerpoint',
	PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	RAR = 'application/vnd.rar',
	RTF = 'application/rtf',
	SH = 'application/x-sh',
	TAR = 'application/x-tar',
	VSD = 'application/vnd.visio',
	XHTML = 'application/xhtml+xml',
	XLS = 'application/vnd.ms-excel',
	XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	XML = 'application/xml',
	XUL = 'application/vnd.mozilla.xul+xml',
	ZIP = 'application/zip',
};

export enum AudioMimeType {
	A_3GP = 'audio/3gpp',
	A_3GP2 = 'audio/3gpp2',
	AAC = 'audio/aac',
	MIDI = 'audio/midi',
	MPEG = 'audio/mpeg',
	OGA = 'audio/ogg',
	OPUS = 'audio/opus',
	WAV = 'audio/wav',
	WEBA = 'audio/webm',
	XMIDI = 'audio/x-midi',
};

export enum VideoMimeType {
	V_3GP = 'video/3gpp',
	V_3GP2 = 'video/3gpp2',
	AVI = 'video/x-msvideo',
	MP4 = 'video/mp4',
	OGV = 'video/ogg',
	TS = 'video/mp2t',
	WEBM = 'video/webm',
};

export enum FontMimeType {
	OTF = 'font/otf',
	TTF = 'font/ttf',
	WOFF = 'font/woff',
	WOFF2 = 'font/woff2',
};

export const MimeType = {
	...ImageMimeType,
	...TextMimeType,
	...DocumentMimeType,
	...AudioMimeType,
	...VideoMimeType,
	...FontMimeType,
};

export const MimeTypeSchema = z.nativeEnum(MimeType);

export const ImageMimeTypeSchema = z.nativeEnum(ImageMimeType);
export const TextMimeTypeSchema = z.nativeEnum(TextMimeType);
export const DocumentMimeTypeSchema = z.nativeEnum(DocumentMimeType);
export const AudioMimeTypeSchema = z.nativeEnum(AudioMimeType);
export const VideoMimeTypeSchema = z.nativeEnum(VideoMimeType);
export const FontMimeTypeSchema = z.nativeEnum(FontMimeType);