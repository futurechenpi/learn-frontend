// Coze API 接口
export async function cozeChat(params: { messages: any[] }, callback: (update: { type: string; content: string }) => void) {
  try {
    // 引入CozeAPI
    const { CozeAPI } = await import("@coze/api");

    const apiClient = new CozeAPI({
      token: "pat_OIdm8eOWCwEn1GoVhqmWFDQFgzNJzRW5meEY4okxOxAGSdOri847UQsS6EIpAT1r",
      allowPersonalAccessTokenInBrowser: true,
      baseURL: "https://api.coze.cn",
    });

    const res = await apiClient.chat.stream({
      bot_id: "7555712738518335488",
      user_id: "123456789",
      additional_messages: params.messages || [],
    });

    // 处理流式响应
    let fullContent = "";
    let suggestions: string[] = [];

    for await (const chunk of res) {
      // 增量消息处理 - conversation.message.delta
      if (chunk.event === "conversation.message.delta" && chunk.data) {
        // 根据API文档，content可能包含增量文本内容
        if (chunk.data.content && typeof chunk.data.content === "string") {
          // 直接将增量内容追加到fullContent
          fullContent += chunk.data.content;

          // 调用回调函数更新UI，实现打字机效果
          callback({
            type: "content",
            content: fullContent,
          });
        }
      }

      // 消息完成处理 - conversation.message.completed
      else if (chunk.event === "conversation.message.completed" && chunk.data) {
        // 提取建议选项
        if (chunk.data.content && chunk.data.type === "follow_up") {
          suggestions.push(chunk.data.content);
        }
      }

      // 会话结束处理 - done
      else if (chunk.event === "done") {
        // 根据API文档，AI返回的回答和建议都放在content里面
        if (chunk.message && chunk.message.content) {
          // 处理最终完整内容
          let finalContent = "";

          if (typeof chunk.message.content === "string") {
            finalContent = chunk.message.content;
          }
          // 处理可能的多模态内容
          else if (Array.isArray(chunk.message.content)) {
            chunk.message.content.forEach((item) => {
              if (item.text) finalContent += item.text;
              else if (item.content) finalContent += item.content;
            });
          }

          if (finalContent) {
            fullContent = finalContent;
            callback({
              type: "content",
              content: fullContent,
            });
          }
        }
      }

      // 错误处理
      else if (chunk.event === "error") {
        console.error("Coze API流式响应错误:", chunk);
        throw new Error(`Coze API错误: ${chunk.message || "未知错误"}`);
      }
    }

    return {
      content: fullContent,
      suggestions: suggestions,
    };
  } catch (error) {
    console.error("Coze API请求失败:", error);
    throw error;
  }
}
