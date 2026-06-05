resource "aws_iam_role" "lambda_transform" {
  name = "analytics-lambda-transform-${var.env}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ Action="sts:AssumeRole"; Effect="Allow"; Principal={ Service="lambda.amazonaws.com" } }]
  })
}

resource "aws_iam_role_policy" "lambda_s3" {
  name = "s3-access"; role = aws_iam_role.lambda_transform.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ Effect="Allow"; Action=["s3:GetObject","s3:PutObject","s3:ListBucket"]
      Resource=[aws_s3_bucket.datalake.arn,"${aws_s3_bucket.datalake.arn}/*"] }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_transform.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "transform" {
  filename         = "${path.module}/../../services/transform/transform.zip"
  function_name    = "analytics-transform-${var.env}"
  role             = aws_iam_role.lambda_transform.arn
  handler          = "handler.handler"
  runtime          = "python3.12"
  timeout          = 300
  memory_size      = 3008
  environment { variables = { S3_BUCKET=aws_s3_bucket.datalake.bucket; AWS_REGION=var.aws_region } }
}

resource "aws_lambda_permission" "s3_trigger" {
  statement_id  = "AllowS3Invoke"; action="lambda:InvokeFunction"
  function_name = aws_lambda_function.transform.function_name
  principal     = "s3.amazonaws.com"; source_arn=aws_s3_bucket.datalake.arn
}

resource "aws_s3_bucket_notification" "trigger_transform" {
  bucket = aws_s3_bucket.datalake.id
  lambda_function {
    lambda_function_arn = aws_lambda_function.transform.arn
    events              = ["s3:ObjectCreated:*"]
    filter_prefix       = "bronze/"; filter_suffix=".parquet"
  }
  depends_on = [aws_lambda_permission.s3_trigger]
}
