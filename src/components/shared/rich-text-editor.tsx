"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Space,
  Tooltip,
  Divider,
  Modal,
  Input,
  Select,
  ColorPicker,
  Upload,
  message,
} from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  LinkOutlined,
  PictureOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  TableOutlined,
  FontColorsOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  ClearOutlined,
  UploadOutlined,
  GlobalOutlined,
  FullscreenOutlined,
  CompressOutlined,
} from "@ant-design/icons";
import type { UploadFile } from "antd/es/upload/interface";

const { Option } = Select;

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "Enter content...",
  height = 300,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [tableModalVisible, setTableModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [uploadImageFile, setUploadImageFile] = useState<UploadFile | null>(
    null
  );

const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

useEffect(() => {
    if (
      isMounted &&
      editorRef.current &&
      value !== editorRef.current.innerHTML
    ) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isMounted]);

const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

const execCommand = useCallback(
    (command: string, value?: string) => {
      if (!editorRef.current) return;

try {
        document.execCommand(command, false, value);
        editorRef.current.focus();
        handleInput();
      } catch (error) {
        console.warn("Command execution failed:", error);
      }
    },
    [handleInput]
  );

// Image handling
  const handleImageUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          execCommand("insertImage", result);
          requestAnimationFrame(() => {
            message.success("Image uploaded successfully");
          });
        }
      };
      reader.readAsDataURL(file);
    },
    [execCommand]
  );

const insertImageFromUrl = useCallback(() => {
    if (imageUrl.trim()) {
      execCommand("insertImage", imageUrl.trim());
      setImageUrl("");
      setImageModalVisible(false);
      requestAnimationFrame(() => {
        message.success("Image inserted successfully");
      });
    }
  }, [imageUrl, execCommand]);

const handleImageModalOk = useCallback(() => {
    if (uploadImageFile) {
      handleImageUpload(uploadImageFile as any);
      setUploadImageFile(null);
      setImageModalVisible(false);
    } else {
      insertImageFromUrl();
    }
  }, [uploadImageFile, insertImageFromUrl, handleImageUpload]);

// Link handling
  const insertLink = useCallback(() => {
    if (linkUrl.trim()) {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        execCommand("createLink", linkUrl.trim());
      } else if (linkText.trim()) {
        const linkHTML = `<a href="${linkUrl.trim()}" target="_blank">${linkText.trim()}</a>`;
        execCommand("insertHTML", linkHTML);
      } else {
        execCommand("createLink", linkUrl.trim());
      }
      setLinkText("");
      setLinkUrl("");
      setLinkModalVisible(false);
      requestAnimationFrame(() => {
        message.success("Link inserted successfully");
      });
    }
  }, [linkText, linkUrl, execCommand]);

// Table insertion
  const insertTable = useCallback(() => {
    let tableHTML =
      '<table border="1" style="border-collapse: collapse; width: 100%; margin: 16px 0;">';

// Create header row
    tableHTML += "<thead><tr>";
    for (let j = 0; j < tableCols; j++) {
      tableHTML +=
        '<th style="padding: 8px; background-color: #f5f5f5; border: 1px solid #d9d9d9;">Header ' +
        (j + 1) +
        "</th>";
    }
    tableHTML += "</tr></thead>";

// Create body rows
    tableHTML += "<tbody>";
    for (let i = 0; i < tableRows - 1; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < tableCols; j++) {
        tableHTML +=
          '<td style="padding: 8px; border: 1px solid #d9d9d9;">Cell ' +
          (i + 1) +
          "-" +
          (j + 1) +
          "</td>";
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</tbody></table><br>";

execCommand("insertHTML", tableHTML);
    setTableModalVisible(false);
    requestAnimationFrame(() => {
      message.success("Table inserted successfully");
    });
  }, [tableRows, tableCols, execCommand]);

// Format block
  const formatBlock = useCallback(
    (tag: string) => {
      execCommand("formatBlock", tag);
    },
    [execCommand]
  );

// Font size
  const changeFontSize = useCallback(
    (size: string) => {
      execCommand("fontSize", size);
    },
    [execCommand]
  );

// Clear formatting
  const clearFormatting = useCallback(() => {
    execCommand("removeFormat");
    execCommand("unlink");
  }, [execCommand]);

// Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

const ToolbarButton: React.FC<{
    icon: React.ReactNode;
    command?: string;
    value?: string;
    onClick?: () => void;
    tooltip: string;
    active?: boolean;
  }> = ({ icon, command, value, onClick, tooltip, active = false }) => (
    <Tooltip title={tooltip}>
      <Button
        type={active ? "primary" : "text"}
        icon={icon}
        onClick={() => {
          if (command) {
            execCommand(command, value);
          } else if (onClick) {
            onClick();
          }
        }}
        disabled={disabled}
        style={{
          color: active ? "#fff" : isFocused ? "#1890ff" : "#666",
          border: "none",
          boxShadow: "none",
        }}
      />
    </Tooltip>
  );

if (!isMounted) {
    return (
      <div
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          minHeight: height,
          padding: "12px",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        Loading editor...
      </div>
    );
  }

const editorStyle = isFullscreen
    ? {
        position: "fixed" as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: "white",
        display: "flex",
        flexDirection: "column" as const,
      }
    : {};

return (
    <>
      <div
        style={{
          ...editorStyle,
          border: `1px solid ${isFocused ? "#1890ff" : "#d9d9d9"}`,
          borderRadius: isFullscreen ? "0" : "6px",
          overflow: "hidden",
          transition: "border-color 0.3s",
        }}
      >
        {}
        <div
          style={{
            padding: "8px 12px",
            borderBottom: "1px solid #f0f0f0",
            backgroundColor: "#fafafa",
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            alignItems: "center",
          }}
        >
          <Space size="small" wrap>
            {}
            <ToolbarButton
              icon={<BoldOutlined />}
              command="bold"
              tooltip="Bold (Ctrl+B)"
            />
            <ToolbarButton
              icon={<ItalicOutlined />}
              command="italic"
              tooltip="Italic (Ctrl+I)"
            />
            <ToolbarButton
              icon={<UnderlineOutlined />}
              command="underline"
              tooltip="Underline (Ctrl+U)"
            />
            <ToolbarButton
              icon={<StrikethroughOutlined />}
              command="strikeThrough"
              tooltip="Strikethrough"
            />

<Divider type="vertical" style={{ margin: "0 4px" }} />

{}
            <Select
              defaultValue="3"
              style={{ width: 70 }}
              onChange={changeFontSize}
              disabled={disabled}
              size="small"
            >
              <Option value="1">8pt</Option>
              <Option value="2">10pt</Option>
              <Option value="3">12pt</Option>
              <Option value="4">14pt</Option>
              <Option value="5">18pt</Option>
              <Option value="6">24pt</Option>
              <Option value="7">36pt</Option>
            </Select>

{}
            <Select
              defaultValue="div"
              style={{ width: 100 }}
              onChange={formatBlock}
              disabled={disabled}
              size="small"
            >
              <Option value="div">Normal</Option>
              <Option value="h1">Header 1</Option>
              <Option value="h2">Header 2</Option>
              <Option value="h3">Header 3</Option>
              <Option value="h4">Header 4</Option>
              <Option value="p">Paragraph</Option>
              <Option value="blockquote">Quote</Option>
            </Select>

<Divider type="vertical" style={{ margin: "0 4px" }} />

{}
            <ColorPicker
              showText={() => <FontColorsOutlined />}
              onChangeComplete={(color) =>
                execCommand("foreColor", color.toHexString())
              }
              disabled={disabled}
            />

{}
            <ColorPicker
              showText={() => <BgColorsOutlined />}
              onChangeComplete={(color) =>
                execCommand("backColor", color.toHexString())
              }
              disabled={disabled}
            />

<Divider type="vertical" style={{ margin: "0 4px" }} />

{}
            <ToolbarButton
              icon={<OrderedListOutlined />}
              command="insertOrderedList"
              tooltip="Ordered List"
            />
            <ToolbarButton
              icon={<UnorderedListOutlined />}
              command="insertUnorderedList"
              tooltip="Unordered List"
            />

<Divider type="vertical" style={{ margin: "0 4px" }} />

{}
            <ToolbarButton
              icon={<AlignLeftOutlined />}
              command="justifyLeft"
              tooltip="Align Left"
            />
            <ToolbarButton
              icon={<AlignCenterOutlined />}
              command="justifyCenter"
              tooltip="Align Center"
            />
            <ToolbarButton
              icon={<AlignRightOutlined />}
              command="justifyRight"
              tooltip="Align Right"
            />

<Divider type="vertical" style={{ margin: "0 4px" }} />

{}
            <ToolbarButton
              icon={<LinkOutlined />}
              onClick={() => setLinkModalVisible(true)}
              tooltip="Insert Link"
            />
            <ToolbarButton
              icon={<PictureOutlined />}
              onClick={() => setImageModalVisible(true)}
              tooltip="Insert Image"
            />
            <ToolbarButton
              icon={<TableOutlined />}
              onClick={() => setTableModalVisible(true)}
              tooltip="Insert Table"
            />
            <ToolbarButton
              icon={<CodeOutlined />}
              command="formatBlock"
              value="pre"
              tooltip="Code Block"
            />

<Divider type="vertical" style={{ margin: "0 4px" }} />

{}
            <ToolbarButton
              icon={<ClearOutlined />}
              onClick={clearFormatting}
              tooltip="Clear Formatting"
            />
            <ToolbarButton
              icon={<UndoOutlined />}
              command="undo"
              tooltip="Undo (Ctrl+Z)"
            />
            <ToolbarButton
              icon={<RedoOutlined />}
              command="redo"
              tooltip="Redo (Ctrl+Y)"
            />

<Divider type="vertical" style={{ margin: "0 4px" }} />

{}
            <ToolbarButton
              icon={
                isFullscreen ? <CompressOutlined /> : <FullscreenOutlined />
              }
              onClick={toggleFullscreen}
              tooltip={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              active={isFullscreen}
            />
          </Space>
        </div>

{}
        <div
          ref={editorRef}
          contentEditable={!disabled}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            minHeight: isFullscreen ? "calc(100vh - 80px)" : height,
            padding: "12px",
            outline: "none",
            fontSize: "14px",
            lineHeight: "1.6",
            backgroundColor: disabled ? "#f5f5f5" : "white",
            flex: isFullscreen ? 1 : "none",
            overflow: "auto",
          }}
          data-placeholder={placeholder}
          suppressContentEditableWarning={true}
        />
      </div>

{}
      <Modal
        title="Insert Image"
        open={imageModalVisible}
        onOk={handleImageModalOk}
        onCancel={() => {
          setImageModalVisible(false);
          setImageUrl("");
          setUploadImageFile(null);
        }}
        width={500}
        destroyOnClose
        maskClosable
        centered
        afterClose={() => {
          setImageUrl("");
          setUploadImageFile(null);
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <div>
            <h4 style={{ marginBottom: 8 }}>Upload from device:</h4>
            <Upload
              beforeUpload={(file) => {
                setUploadImageFile(file);
                setImageUrl(""); // Clear URL if file is selected
                return false; // Prevent auto upload
              }}
              onRemove={() => setUploadImageFile(null)}
              fileList={uploadImageFile ? [uploadImageFile] : []}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Choose Image File</Button>
            </Upload>
          </div>

<div>
            <h4 style={{ marginBottom: 8 }}>Or enter image URL:</h4>
            <Input
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                if (e.target.value.trim()) {
                  setUploadImageFile(null); // Clear file if URL is entered
                }
              }}
              prefix={<GlobalOutlined />}
            />
          </div>
        </Space>
      </Modal>

{}
      <Modal
        title="Insert Link"
        open={linkModalVisible}
        onOk={insertLink}
        onCancel={() => {
          setLinkModalVisible(false);
          setLinkText("");
          setLinkUrl("");
        }}
        destroyOnClose
        maskClosable
        centered
        afterClose={() => {
          setLinkText("");
          setLinkUrl("");
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <label>Link Text (optional if text is selected):</label>
            <Input
              placeholder="Click here"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              style={{ marginTop: 4 }}
            />
          </div>
          <div>
            <label>URL:</label>
            <Input
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              style={{ marginTop: 4 }}
              prefix={<GlobalOutlined />}
            />
          </div>
        </Space>
      </Modal>

{}
      <Modal
        title="Insert Table"
        open={tableModalVisible}
        onOk={insertTable}
        onCancel={() => setTableModalVisible(false)}
        destroyOnClose
        maskClosable
        centered
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <label>Rows:</label>
            <Select
              value={tableRows}
              onChange={setTableRows}
              style={{ width: "100%", marginTop: 4 }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label>Columns:</label>
            <Select
              value={tableCols}
              onChange={setTableCols}
              style={{ width: "100%", marginTop: 4 }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Option key={num} value={num}>
                  {num}
                </Option>
              ))}
            </Select>
          </div>
        </Space>
      </Modal>

<style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #bfbfbf;
          font-style: italic;
        }
        [contenteditable] h1,
        [contenteditable] h2,
        [contenteditable] h3,
        [contenteditable] h4 {
          margin: 16px 0 8px 0;
          font-weight: bold;
        }
        [contenteditable] h1 {
          font-size: 24px;
        }
        [contenteditable] h2 {
          font-size: 20px;
        }
        [contenteditable] h3 {
          font-size: 16px;
        }
        [contenteditable] h4 {
          font-size: 14px;
        }
        [contenteditable] ul,
        [contenteditable] ol {
          margin: 8px 0;
          padding-left: 24px;
        }
        [contenteditable] blockquote {
          margin: 16px 0;
          padding: 8px 16px;
          border-left: 4px solid #1890ff;
          background-color: #f6f8fa;
          font-style: italic;
        }
        [contenteditable] pre {
          background-color: #f6f8fa;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: "Courier New", monospace;
          border: 1px solid #e1e4e8;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 8px 0;
        }
        [contenteditable] a {
          color: #1890ff;
          text-decoration: underline;
        }
        [contenteditable] a:hover {
          color: #40a9ff;
        }
        [contenteditable] table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
        }
        [contenteditable] table th,
        [contenteditable] table td {
          padding: 8px;
          border: 1px solid #d9d9d9;
          text-align: left;
        }
        [contenteditable] table th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        [contenteditable] table tr:nth-child(even) {
          background-color: #fafafa;
        }
        [contenteditable] table tr:hover {
          background-color: #e6f7ff;
        }
      `}</style>
    </>
  );
};

export default RichTextEditor;
