"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components";
import {
  useTemplates,
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate
} from "@/features/gmail/hooks";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import {
  Plus,
  Mail,
  Edit2,
  Trash2,
  Save,
  X,
  Type,
  Layout,
  Hash
} from "lucide-react";
import { toast } from "react-toastify";

const VARIABLES = [
  { name: "email", label: "Email" },
  { name: "name", label: "Full Name" },
  { name: "firstName", label: "First Name" },
  { name: "lastName", label: "Last Name" },
  { name: "agency", label: "Agency" },
  { name: "phone", label: "Phone" },
  { name: "address", label: "Address" },
  { name: "status", label: "Status" },
];

export default function TemplatesPage() {
  const { data, isLoading } = useTemplates();
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();
  const deleteMutation = useDeleteTemplate();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    step: 1,
  });

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const templates = data?.success ? data.templates : [];

  const handleInsertVariable = (variable: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      // Fallback if ref is not available
      setFormData((prev) => ({
        ...prev,
        body: prev.body + `{${variable}}`,
      }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const varText = `{${variable}}`;

    const newBody = before + varText + after;

    setFormData((prev) => ({
      ...prev,
      body: newBody,
    }));

    // Reset cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + varText.length, start + varText.length);
    }, 0);
  };

  const handleSave = () => {
    if (!formData.subject || !formData.body) {
      toast.error("Subject and Body are required");
      return;
    }

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, data: formData },
        {
          onSuccess: () => {
            toast.success("Template updated");
            setEditingId(null);
            resetForm();
          },
        }
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("Template created");
          setIsAdding(false);
          resetForm();
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Template deleted"),
      });
    }
  };

  const handleEdit = (template: any) => {
    setFormData({
      subject: template.subject,
      body: template.body,
      step: template.step,
    });
    setEditingId(template.id);
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({ subject: "", body: "", step: 1 });
    setIsAdding(false);
    setEditingId(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Email Templates</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage reusable email templates for your campaigns.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Template</span>
            </button>
          )}
        </div>

        {isAdding && (
          <Card className="border-primary/20 shadow-xl animate-in slide-in-from-top-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingId ? "Edit Template" : "New Template"}</CardTitle>
              <button onClick={resetForm} className="p-2 hover:bg-secondary rounded-lg">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-3 space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" />
                    Subject Line
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Question about [agency]"
                    className="w-full bg-secondary/50 border-border focus:ring-primary/20 rounded-xl px-4 py-2.5 outline-none focus:ring-2 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    Step Number
                  </label>
                  <input
                    type="number"
                    value={formData.step}
                    onChange={(e) => setFormData({ ...formData, step: parseInt(e.target.value) })}
                    className="w-full bg-secondary/50 border-border focus:ring-primary/20 rounded-xl px-4 py-2.5 outline-none focus:ring-2 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground self-center mr-2">
                    Variables:
                  </span>
                  {VARIABLES.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => handleInsertVariable(v.name)}
                      className="px-3 py-1 bg-primary/5 text-primary text-xs font-semibold rounded-full border border-primary/10 hover:bg-primary/10 transition-colors"
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Layout className="w-4 h-4 text-primary" />
                    Email Body
                  </label>
                  <textarea
                    ref={textareaRef}
                    rows={8}
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Write your email content here. Use the variable pills above to insert dynamic data."
                    className="w-full bg-secondary/50 border-border focus:ring-primary/20 rounded-xl px-4 py-4 outline-none focus:ring-2 transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 rounded-xl font-semibold hover:bg-secondary transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="bg-primary text-primary-foreground px-8 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingId ? "Update Template" : "Save Template"}</span>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : templates.length === 0 && !isAdding ? (
            <div className="col-span-full text-center py-20 bg-card/50 border border-dashed border-border rounded-3xl">
              <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold">No templates yet</h3>
              <p className="text-muted-foreground mt-1 mb-6">Start by creating your first outreach template.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="text-primary font-bold hover:underline"
              >
                Create one now
              </button>
            </div>
          ) : (
            templates.map((template) => (
              <Card key={template.id} className="group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(template)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-primary"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(template.id)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                        Step {template.step}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                      {template.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {template.body}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
