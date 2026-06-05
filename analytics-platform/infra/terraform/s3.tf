resource "aws_s3_bucket" "datalake" {
  bucket = "${var.bucket_name}-${var.env}"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "datalake" {
  bucket = aws_s3_bucket.datalake.id
  rule { apply_server_side_encryption_by_default { sse_algorithm = "AES256" } }
}

resource "aws_s3_bucket_lifecycle_configuration" "datalake" {
  bucket = aws_s3_bucket.datalake.id
  rule {
    id = "bronze-ia"; status = "Enabled"
    filter { prefix = "bronze/" }
    transition { days = 30; storage_class = "STANDARD_IA" }
  }
  rule {
    id = "silver-ia"; status = "Enabled"
    filter { prefix = "silver/" }
    transition { days = 60; storage_class = "STANDARD_IA" }
  }
}

resource "aws_s3_bucket_public_access_block" "datalake" {
  bucket                  = aws_s3_bucket.datalake.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
