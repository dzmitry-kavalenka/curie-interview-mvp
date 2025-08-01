"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  Bookmark,
  Plus,
  Clock,
  User,
} from "lucide-react";

export function DocumentPanel() {
  const [annotations, setAnnotations] = useState([
    {
      id: 1,
      text: "Important section about project requirements",
      page: 1,
      timestamp: "2 min ago",
      author: "John Doe",
      tags: ["important", "requirements"],
    },
    {
      id: 2,
      text: "Need to review this calculation",
      page: 3,
      timestamp: "5 min ago",
      author: "Jane Smith",
      tags: ["review", "calculation"],
    },
  ]);

  const [bookmarks, setBookmarks] = useState([
    {
      id: 1,
      title: "Introduction",
      page: 1,
      description: "Document overview and objectives",
    },
    {
      id: 2,
      title: "Technical Requirements",
      page: 5,
      description: "System architecture and specifications",
    },
    {
      id: 3,
      title: "Conclusion",
      page: 12,
      description: "Summary and next steps",
    },
  ]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg truncate">Document Viewer</h2>
        <p className="text-sm text-muted-foreground">
          Interactive PDF Analysis
        </p>
      </div>

      <Tabs defaultValue="summary" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 p-1">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="annotations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="summary" className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">AI Summary</h3>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  Generate
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-3 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Document Overview
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This document appears to be a technical specification
                    containing project requirements, implementation details, and
                    architectural guidelines. The content spans multiple
                    sections covering both frontend and backend considerations.
                  </p>
                </div>

                <div className="p-3 border border-border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Key Points</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Project scope and objectives
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Technical architecture overview
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Implementation timeline
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      Resource requirements
                    </li>
                  </ul>
                </div>

                <div className="p-3 border border-border rounded-lg">
                  <h4 className="font-medium text-sm mb-2">
                    Claims & Insights
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      LLMs can summarize complex text with ~85% accuracy
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      Prompt tuning significantly affects factual recall
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annotations" className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Annotations & Notes</h3>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Note
                </Button>
              </div>

              <div className="space-y-3">
                {annotations.map((annotation) => (
                  <div
                    key={annotation.id}
                    className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        Page {annotation.page}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {annotation.timestamp}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{annotation.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        {annotation.author}
                      </div>
                      <div className="flex gap-1">
                        {annotation.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-muted px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Bookmarks</h3>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Bookmark
                </Button>
              </div>

              <div className="space-y-2">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="flex items-start justify-between p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Bookmark className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">{bookmark.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">
                        {bookmark.description}
                      </p>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        Page {bookmark.page}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
