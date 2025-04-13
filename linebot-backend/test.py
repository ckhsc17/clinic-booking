from flask import Flask, request, abort
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import *
from linebot.models import MessageEvent, TextMessage, TextSendMessage

import os

app = Flask(__name__)

# 從環境變數中讀取 LINE Bot 的 Channel Access Token 和 Channel Secret
line_bot_api = LineBotApi(os.environ.get('CHANNEL_ACCESS_TOKEN'))
handler = WebhookHandler(os.environ.get('CHANNEL_SECRET'))

# 監聽來自 /callback 的 POST 請求
@app.route("/callback", methods=['POST'])
def callback():
    signature = request.headers['X-Line-Signature']
    if not signature:
        abort(400, description="Missing X-Line-Signature header")
    print("🔍 LINE Signature:", signature)
    body = request.get_data(as_text=True)
    print("🔍 Body:", body)
    app.logger.info("Request body: " + body)
    try:
        handler.handle(body, signature)
    except InvalidSignatureError:
        print("❌ Invalid signature!")
        abort(400)
    return 'OK', 200

# ✅ 改成 v1 SDK 的事件處理方式
@handler.add(MessageEvent, message=TextMessage)
def handle_message(event):
    # 回覆使用者剛傳來的文字（Echo Bot）
    line_bot_api.reply_message(
        event.reply_token,
        TextSendMessage(text=event.message.text)
    )

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))  # 預設 8080
    app.run(host="0.0.0.0", port=port)