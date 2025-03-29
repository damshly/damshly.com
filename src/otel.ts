import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { LoggerProvider, SimpleLogRecordProcessor } from '@opentelemetry/sdk-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// إعداد المورد (Resource)
const resource = resourceFromAttributes({
  [SemanticResourceAttributes.SERVICE_NAME]: 'damshly_blog',
});

// إعداد OpenTelemetry Tracing باستخدام NodeTracerProvider
const provider = new NodeTracerProvider({
  resource,
  spanProcessors: [
    new SimpleSpanProcessor(new ConsoleSpanExporter()),
  ],
});
provider.register();

// إعداد OpenTelemetry Logging
const loggerProvider = new LoggerProvider();
const exporter = new OTLPLogExporter({
  url: 'http://localhost:4318/v1/logs', // تأكد من أن هذا الرابط يشير إلى الخدمة الصحيحة
});
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(exporter));

// تمكين التصحيح (Debugging)
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ALL);

console.log('✅ OpenTelemetry logging initialized');

// تصدير الـ logger لاستخدامه في باقي التطبيق
export const logger = loggerProvider.getLogger('bun-logger');

setTimeout(() => {
    console.log("Attempting to send OpenTelemetry log...");
    logger.emit({
      severityText: 'INFO',
      body: 'OpenTelemetry Logging is working!',
    });
    console.log("OpenTelemetry log sent (or attempted).");
  }, 90000);