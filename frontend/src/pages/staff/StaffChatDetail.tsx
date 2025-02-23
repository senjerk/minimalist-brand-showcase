import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { API_CONFIG } from "@/config/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ChevronLeft, Menu, MessageSquarePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import Cookies from 'js-cookie';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatList } from "../components/ChatList";
import { CreateChatDialog } from "@/components/CreateChatDialog";
import { Textarea } from "@/components/ui/textarea";

// ... остальной код без изменений ... 