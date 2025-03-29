import { NodeSDK } from '@opentelemetry/sdk-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';

// تفعيل التصحيح Debug عند الحاجة
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

// إنشاء `BatchLogRecordProcessor`
const logExporter = new OTLPLogExporter({
  url: 'http://otel-collector:4318/v1/logs',
});

// إنشاء OpenTelemetry SDK
const sdk = new NodeSDK({
  logRecordProcessor: new BatchLogRecordProcessor(logExporter),
});

// تشغيل SDK
sdk.start();
console.log('✅ OpenTelemetry Logging Initialized');
