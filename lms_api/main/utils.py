import base64
import hmac
import hashlib

def generate_esewa_signature(total_amount, transaction_uuid, product_code, secret_key="8gBmpyzACX4A"):
    # 1. Exact parameter concatenation string required by eSewa v2:
    data_to_sign = f"total_amount={total_amount},transaction_uuid={transaction_uuid},product_code={product_code}"
    
    # 2. HMAC-SHA256 hash calculation
    secret_bytes = secret_key.encode('utf-8')
    message_bytes = data_to_sign.encode('utf-8')
    
    signature = hmac.new(secret_bytes, message_bytes, hashlib.sha256).digest()
    
    # 3. Base64 encoding
    return base64.b64encode(signature).decode('utf-8')