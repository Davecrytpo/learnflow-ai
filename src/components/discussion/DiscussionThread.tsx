import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DiscussionThreadProps {
  discussion: any;
}

const DiscussionThread = ({ discussion }: DiscussionThreadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchReplies();
  }, [discussion._id]);

  const fetchReplies = async () => {
    setLoading(true);
    try {
      const response = await api.get("/replies", { params: { discussion_id: discussion._id } });
      setReplies(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitReply = async () => {
    if (!user || !replyContent.trim()) return;
    setSending(true);
    try {
      await api.post("/replies", {
        discussion_id: discussion._id,
        content: replyContent,
      });
      toast({ title: "Reply posted!" });
      setReplyContent("");
      fetchReplies();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.error || "Failed to post reply", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-muted/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarImage src={discussion.profiles?.avatar_url} />
              <AvatarFallback>{discussion.profiles?.display_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{discussion.title}</h3>
                <span className="text-xs text-muted-foreground">{new Date(discussion.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{discussion.content}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 pl-4 border-l-2 border-muted ml-4">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : replies.length === 0 ? (
          <p className="text-sm text-muted-foreground italic pl-4">No replies yet.</p>
        ) : (
          replies.map((reply) => (
            <div key={reply.id} className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.profiles?.avatar_url} />
                <AvatarFallback className="text-xs">{reply.profiles?.display_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1 rounded-lg bg-card border p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs">{reply.profiles?.display_name || "User"}</span>
                  <span className="text-[10px] text-muted-foreground">{new Date(reply.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-foreground whitespace-pre-wrap">{reply.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-4 items-start pt-4 border-t border-border">
        <Avatar className="h-8 w-8">
          <AvatarFallback>me</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px]"
          />
          <Button onClick={submitReply} disabled={sending || !replyContent.trim()} size="sm" className="ml-auto flex gap-2">
            {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscussionThread;
