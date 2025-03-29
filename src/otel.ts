import { logs } from "@opentelemetry/api";
import { LoggerProvider, SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

// إعداد المصدّر (Exporter) لإرسال الـ logs عبر HTTP إلى OpenTelemetry Collector
const exporter = new OTLPLogExporter({
  url: "http://localhost:4318/v1/logs",
});

// إعداد LoggerProvider مع المعالج (Processor) والمصدر (Exporter)
const loggerProvider = new LoggerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "damshly_blog",
  }),
});

loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(exporter));
logs.setGlobalLoggerProvider(loggerProvider);

// إنشاء logger لاستخدامه في التطبيق
export const logger = loggerProvider.getLogger("bun-logger");
