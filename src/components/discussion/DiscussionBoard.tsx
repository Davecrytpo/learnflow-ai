import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, Plus, ArrowLeft } from "lucide-react";
import DiscussionThread from "./DiscussionThread";

interface DiscussionBoardProps {
  courseId: string;
}

const DiscussionBoard = ({ courseId }: DiscussionBoardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedDiscussion, setSelectedDiscussion] = useState<any | null>(null);

  useEffect(() => {
    fetchDiscussions();
  }, [courseId]);

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const response = await api.get("/discussions", { params: { course_id: courseId } });
      setDiscussions(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createDiscussion = async () => {
    if (!user) return;
    try {
      await api.post("/discussions", {
        course_id: courseId,
        title,
        content,
      });
      toast({ title: "Discussion created!" });
      setCreating(false);
      setTitle("");
      setContent("");
      fetchDiscussions();
    } catch (error: any) {
      toast({ title: "Error", description: error.response?.data?.error || "Failed to create discussion", variant: "destructive" });
    }
  };

  if (selectedDiscussion) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setSelectedDiscussion(null)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Discussions
        </Button>
        <DiscussionThread discussion={selectedDiscussion} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Course Discussions</h2>
        <Button onClick={() => setCreating(!creating)} variant={creating ? "secondary" : "default"}>
          {creating ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> New Discussion</>}
        </Button>
      </div>

      {creating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Start a New Discussion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Topic Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
            <Button onClick={createDiscussion} disabled={!title || !content}>
              Post Discussion
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : discussions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MessageSquare className="mx-auto h-12 w-12 opacity-20" />
          <p className="mt-4">No discussions yet. Be the first to start one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <Card
              key={discussion.id}
              className="cursor-pointer transition-colors hover:bg-accent/5"
              onClick={() => setSelectedDiscussion(discussion)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{discussion.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{discussion.content}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                      <span>Posted by {discussion.profiles?.display_name || "User"}</span>
                      <span>-</span>
                      <span>{new Date(discussion.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <MessageSquare className="h-5 w-5 text-muted-foreground mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscussionBoard;



