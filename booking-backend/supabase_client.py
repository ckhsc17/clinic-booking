from supabase import create_client, Client
import os
from dotenv import load_dotenv

# 建立supabase物件

load_dotenv()  # 載入 .env 檔案

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
