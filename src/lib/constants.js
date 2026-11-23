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
  note: "bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/20 dark:text-emerald-300",
  link: "bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-sky-500/20 dark:text-sky-300",
  memory: "bg-rose-500/10 text-rose-700 ring-1 ring-inset ring-rose-500/20 dark:text-rose-300",
  video: "bg-violet-500/10 text-violet-700 ring-1 ring-inset ring-violet-500/20 dark:text-violet-300",
  image: "bg-amber-500/10 text-amber-700 ring-1 ring-inset ring-amber-500/20 dark:text-amber-300",
  document: "bg-slate-500/10 text-slate-700 ring-1 ring-inset ring-slate-500/20 dark:text-slate-300",
  book: "bg-lime-500/10 text-lime-700 ring-1 ring-inset ring-lime-500/20 dark:text-lime-300",
  movie: "bg-orange-500/10 text-orange-700 ring-1 ring-inset ring-orange-500/20 dark:text-orange-300",
  idea: "bg-yellow-500/10 text-yellow-700 ring-1 ring-inset ring-yellow-500/20 dark:text-yellow-300",
  event: "bg-teal-500/10 text-teal-700 ring-1 ring-inset ring-teal-500/20 dark:text-teal-300",
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
