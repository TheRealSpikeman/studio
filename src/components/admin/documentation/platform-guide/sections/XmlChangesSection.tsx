// src/components/admin/documentation/platform-guide/sections/XmlChangesSection.tsx
"use client";

import { GitBranch } from "@/lib/icons";
import { GuideSection } from "../GuideSection";

const xmlExample = `<changes>
  <description>[Provide a concise summary of the overall changes being made]</description>
  <change>
    <file>[Provide the ABSOLUTE, FULL path to the file being modified]</file>
    <content><![CDATA[Provide the ENTIRE, FINAL, intended content of the file here. Do NOT provide diffs or partial snippets. Ensure all code is properly escaped within the CDATA section.