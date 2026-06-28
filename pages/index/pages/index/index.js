const zhStarters = [
  "负责",
  "参与",
  "协助",
  "整理",
  "提升",
  "维护",
  "沟通",
  "完成"
];

const enStarters = [
  "Managed",
  "Supported",
  "Coordinated",
  "Organized",
  "Improved",
  "Maintained",
  "Communicated",
  "Delivered"
];

Page({
  data: {
    role: "",
    language: "中文",
    tone: "专业",
    resume: "",
    polished: "",
    loading: false
  },

  onRoleInput(event) {
    this.setData({ role: event.detail.value });
  },

  onResumeInput(event) {
    this.setData({ resume: event.detail.value });
  },

  chooseLanguage(event) {
    this.setData({ language: event.currentTarget.dataset.value });
  },

  chooseTone(event) {
    this.setData({ tone: event.currentTarget.dataset.value });
  },

  polishResume() {
    const { resume, role, language, tone } = this.data;

    if (!resume.trim()) {
      wx.showToast({
        title: "先粘贴简历内容",
        icon: "none"
      });
      return;
    }

    this.setData({ loading: true });

    setTimeout(() => {
      const polished = language === "English"
        ? buildEnglishResume(resume, role, tone)
        : buildChineseResume(resume, role, tone);

      this.setData({
        polished,
        loading: false
      });
    }, 450);
  },

  copyResult() {
    wx.setClipboardData({
      data: this.data.polished,
      success() {
        wx.showToast({
          title: "已复制",
          icon: "success"
        });
      }
    });
  }
});

function buildChineseResume(input, role, tone) {
  const lines = splitLines(input);
  const target = role.trim() || "目标岗位";
  const intro = `求职目标：${target}\n个人亮点：具备清晰沟通、稳定执行和快速学习能力，能在高节奏环境中保持可靠交付。`;
  const bullets = lines.map((line, index) => {
    const starter = zhStarters[index % zhStarters.length];
    const cleaned = cleanSentence(line);
    const impact = tone === "有冲击力"
      ? "，突出效率、服务体验与结果意识"
      : tone === "简洁"
        ? ""
        : "，确保流程准确、体验顺畅";
    return `- ${starter}${cleaned}${impact}。`;
  });

  return `${intro}\n\n经历润色：\n${bullets.join("\n")}\n\n建议补充：加入数字结果，例如服务人数、销售额、处理订单量、节省时间或客户好评。`;
}

function buildEnglishResume(input, role, tone) {
  const lines = splitLines(input);
  const target = role.trim() || "Target Role";
  const intro = `Target Role: ${target}\nProfile: Reliable and fast-learning candidate with strong communication, ownership, and service mindset.`;
  const bullets = lines.map((line, index) => {
    const starter = enStarters[index % enStarters.length];
    const cleaned = cleanSentence(line).replace(/[。；，]/g, ",");
    const impact = tone === "有冲击力"
      ? ", with a focus on speed, quality, and measurable outcomes"
      : tone === "简洁"
        ? ""
        : ", ensuring accurate execution and a smooth customer experience";
    return `- ${starter} ${lowerFirst(cleaned)}${impact}.`;
  });

  return `${intro}\n\nPolished Experience:\n${bullets.join("\n")}\n\nTip: Add numbers such as customers served, orders handled, revenue supported, time saved, or satisfaction scores.`;
}

function splitLines(input) {
  return input
    .split(/\n|。|；|;/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 8);
}

function cleanSentence(line) {
  return line
    .replace(/^我(主要)?/g, "")
    .replace(/^(本人|自己)/g, "")
    .replace(/[.。]+$/g, "")
    .trim();
}

function lowerFirst(text) {
  if (!text) return "relevant responsibilities";
  return text.charAt(0).toLowerCase() + text.slice(1);
}
