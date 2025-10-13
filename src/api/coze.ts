// Coze API 接口（支持可选 botId）
export async function cozeChat(
  params: { messages: any[]; botId?: string },
  callback: (update: { type: string; content: string }) => void
) {
  try {
    // 引入CozeAPI
    const { CozeAPI } = await import("@coze/api");

    const apiClient = new CozeAPI({
      token: "pat_OIdm8eOWCwEn1GoVhqmWFDQFgzNJzRW5meEY4okxOxAGSdOri847UQsS6EIpAT1r",
      allowPersonalAccessTokenInBrowser: true,
      baseURL: "https://api.coze.cn",
    });

    const res = await apiClient.chat.stream({
      bot_id: params.botId || "7555712738518335488",
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

      // 仅在 completed 事件读取 message，done 表示流结束
      else if (chunk.event === "done") {
        // no-op: 流结束标志
      }

      // 错误处理
      else if (chunk.event === "error") {
        console.error("Coze API流式响应错误:", chunk);
        const msg = (chunk as any)?.data?.msg || '未知错误'
        throw new Error(`Coze API错误: ${msg}`);
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

// 基于指定 botId 的 Coze 流式聊天（用于后台独立 Agent）
// export async function cozeChatWithBot(botId: string, params: { messages: any[] }, callback: (update: { type: string; content: string }) => void) {
//   try {
//     const { CozeAPI } = await import("@coze/api");

//     const apiClient = new CozeAPI({
//       token: "pat_OIdm8eOWCwEn1GoVhqmWFDQFgzNJzRW5meEY4okxOxAGSdOri847UQsS6EIpAT1r",
//       allowPersonalAccessTokenInBrowser: true,
//       baseURL: "https://api.coze.cn",
//     });

//     const res = await apiClient.chat.stream({
//       bot_id: botId,
//       user_id: "admin-agent",
//       additional_messages: params.messages || [],
//     });

//     let fullContent = "";
//     const suggestions: string[] = []

//     for await (const chunk of res) {
//       if (chunk.event === "conversation.message.delta" && chunk.data) {
//         if (chunk.data.content && typeof chunk.data.content === "string") {
//           fullContent += chunk.data.content;
//           callback({ type: "content", content: fullContent });
//         }
//       } else if (chunk.event === "conversation.message.completed" && chunk.data) {
//         const msg: any = chunk.data
//         // 跟随型建议
//         if (msg.type === 'follow_up' && msg.content) {
//           suggestions.push(msg.content)
//         } else {
//           // 保底：完成时也可能携带完整内容（非建议类型）
//           let finalContent = ""
//           if (typeof msg.content === 'string') finalContent = msg.content
//           else if (Array.isArray(msg.content)) {
//             msg.content.forEach((item: any) => {
//               if (item.text) finalContent += item.text; else if (item.content) finalContent += item.content
//             })
//           }
//           if (finalContent) callback({ type: 'content', content: finalContent })
//         }
//       } else if (chunk.event === "done") {
//         // no-op
//       } else if (chunk.event === "error") {
//         console.error("Coze API流式响应错误:", chunk);
//         const msg = (chunk as any)?.data?.msg || '未知错误'
//         throw new Error(`Coze API错误: ${msg}`);
//       }
//     }

//     return { content: fullContent, suggestions };
//   } catch (error) {
//     console.error("Coze API请求失败:", error);
//     throw error;
//   }
// }
