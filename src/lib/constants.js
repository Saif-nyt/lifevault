import {
  BookOpen,
  Bookmark,
  CalendarClock,
  CalendarDays,
  Compass,
  FileText,
  Film,
  FolderHeart,
  Home,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  Link2,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/archives", label: "All Archives", icon: Layers },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/memories", label: "Memories", icon: Compass },
  { href: "/entertainment", label: "Entertainment", icon: Film },
  { href: "/ideas", label: "Ideas", icon: Lightbulb },
  { href: "/collections", label: "Collections", icon: FolderHeart },
  { href: "/timeline", label: "Timeline", icon: CalendarDays },
  { href: "/reminders", label: "Reminders", icon: CalendarClock },
  { href: "/favorites", label: "Favorites", icon: Bookmark },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const MOBILE_NAV = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/archives", label: "Archives", icon: Layers },
  { href: "/collections", label: "Collections", icon: FolderHeart },
  { href: "/timeline", label: "Timeline", icon: CalendarDays },
];

export const ARCHIVE_TYPES = [
  { value: "note", label: "Note", icon: FileText, description: "Written thoughts and study notes" },
  { value: "link", label: "Link", icon: Link2, description: "An online resource worth keeping" },
  { value: "memory", label: "Memory", icon: Compass, description: "A moment, place or feeling" },
  { value: "video", label: "Video", icon: Film, description: "A talk, clip or channel" },
  { value: "image", label: "Image", icon: ImageIcon, description: "A photo or visual reference" },
  { value: "document", label: "Document", icon: FileText, description: "A PDF or file" },
  { value: "book", label: "Book", icon: BookOpen, description: "Reading list and notes" },
  { value: "movie", label: "Movie", icon: Film, description: "Films and shows you track" },
  { value: "idea", label: "Idea", icon: Lightbulb, description: "A thought to explore" },
  { value: "event", label: "Event", icon: CalendarClock, description: "A date worth remembering" },
];

export const TYPE_MAP = Object.fromEntries(ARCHIVE_TYPES.map((type) => [type.value, type]));

export const TYPE_CHIPS = {
  note: "bg-[#e8ede6] text-[#3d5a44] dark:bg-[#26332a] dark:text-[#b8ceb9]",
  link: "bg-[#e7ebef] text-[#3f5568] dark:bg-[#262f36] dark:text-[#b5c8d5]",
  memory: "bg-[#f1e5e4] text-[#7a4b4b] dark:bg-[#3a292a] dark:text-[#e0b9b5]",
  video: "bg-[#ebe6f0] text-[#5b4a70] dark:bg-[#312a3a] dark:text-[#d2c2e2]",
  image: "bg-[#efe9dd] text-[#6d5a3c] dark:bg-[#352f25] dark:text-[#dbc7a5]",
  document: "bg-[#ece9e2] text-[#5b554a] dark:bg-[#2c2b25] dark:text-[#c8c2b4]",
  book: "bg-[#e9ebe0] text-[#56603c] dark:bg-[#2d3225] dark:text-[#c6d2a6]",
  movie: "bg-[#f0e7e2] text-[#7a5040] dark:bg-[#362a24] dark:text-[#e2bba8]",
  idea: "bg-[#f3edda] text-[#74602a] dark:bg-[#383222] dark:text-[#e6ce8d]",
  event: "bg-[#e3ecec] text-[#3f6060] dark:bg-[#243333] dark:text-[#aed3d2]",
};

export const BOOK_STATUS = [
  { value: "want-to-read", label: "Want to read" },
  { value: "reading", label: "Reading" },
  { value: "completed", label: "Completed" },
];

export const MOVIE_STATUS = [
  { value: "to-watch", label: "To watch" },
  { value: "watching", label: "Watching" },
  { value: "watched", label: "Watched" },
];

export const IDEA_STATUS = [
  { value: "draft", label: "Draft" },
  { value: "exploring", label: "Exploring" },
  { value: "implemented", label: "Implemented" },
  { value: "archived", label: "Archived" },
];

export const IDEA_PRIORITY = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];
