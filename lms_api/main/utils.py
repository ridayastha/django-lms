import base64
import hmac
import hashlib


def generate_esewa_signature(
    total_amount,
    transaction_uuid,
    product_code,
    secret_key,
):
    """
    Generate the HMAC-SHA256 signature required by eSewa v2.

    The signed string must be in exactly this order:
    total_amount,transaction_uuid,product_code
    """

    data_to_sign = (
        f"total_amount={total_amount},"
        f"transaction_uuid={transaction_uuid},"
        f"product_code={product_code}"
    )

    secret_bytes = secret_key.encode("utf-8")
    message_bytes = data_to_sign.encode("utf-8")

    signature = hmac.new(
        secret_bytes,
        message_bytes,
        hashlib.sha256,
    ).digest()

    return base64.b64encode(signature).decode("utf-8")
