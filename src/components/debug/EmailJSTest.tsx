import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { testNotificationSetup } from "@/services/notificationService";
import { EMAILJS_CONFIG } from "@/config/emailjs";
import { TestTube, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export function EmailJSTest() {
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [testResults, setTestResults] = useState<{
    email: boolean | null;
    whatsapp: boolean | null;
  }>({ email: null, whatsapp: null });
  const { toast } = useToast();

  const runTest = async () => {
    setIsTestingEmail(true);
    setTestResults({ email: null, whatsapp: null });

    try {
      const success = await testNotificationSetup();
      
      if (success) {
        setTestResults({ email: true, whatsapp: true });
        toast({
          title: "Teste realizado!",
          description: "Verifique seu email e WhatsApp para confirmar o recebimento.",
        });
      } else {
        setTestResults({ email: false, whatsapp: false });
        toast({
          title: "Teste falhou",
          description: "Verifique as configurações do EmailJS.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erro no teste:", error);
      setTestResults({ email: false, whatsapp: false });
      toast({
        title: "Erro no teste",
        description: "Verifique o console para mais detalhes.",
        variant: "destructive"
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const isConfigured = 
    EMAILJS_CONFIG.SERVICE_ID !== 'your_service_id' &&
    EMAILJS_CONFIG.TEMPLATE_ID !== 'your_template_id' &&
    EMAILJS_CONFIG.PUBLIC_KEY !== 'your_public_key';

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube className="w-5 h-5" />
          Teste de Configuração EmailJS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status da Configuração */}
        <div className="space-y-2">
          <h3 className="font-medium">Status da Configuração:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {isConfigured ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500" />
              )}
              <span className={isConfigured ? "text-green-700" : "text-red-700"}>
                {isConfigured ? "Configurado" : "Não configurado"}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {EMAILJS_CONFIG.WHATSAPP_NUMBER !== '5511999999999' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
              <span>WhatsApp: {EMAILJS_CONFIG.WHATSAPP_NUMBER}</span>
            </div>
          </div>
        </div>

        {/* Configurações Atuais */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <h3 className="font-medium">Configurações Atuais:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Service ID:</strong> {EMAILJS_CONFIG.SERVICE_ID}</p>
            <p><strong>Template ID:</strong> {EMAILJS_CONFIG.TEMPLATE_ID}</p>
            <p><strong>Public Key:</strong> {EMAILJS_CONFIG.PUBLIC_KEY.substring(0, 10)}...</p>
            <p><strong>Email Destino:</strong> {EMAILJS_CONFIG.TO_EMAIL}</p>
            <p><strong>WhatsApp:</strong> {EMAILJS_CONFIG.WHATSAPP_NUMBER}</p>
          </div>
        </div>

        {/* Botão de Teste */}
        <Button 
          onClick={runTest} 
          disabled={isTestingEmail || !isConfigured}
          className="w-full"
        >
          {isTestingEmail ? "Testando..." : "Testar Configuração"}
        </Button>

        {/* Resultados do Teste */}
        {(testResults.email !== null || testResults.whatsapp !== null) && (
          <div className="space-y-2">
            <h3 className="font-medium">Resultados do Teste:</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {testResults.email ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>Email</span>
              </div>
              <div className="flex items-center gap-2">
                {testResults.whatsapp ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
                <span>WhatsApp</span>
              </div>
            </div>
          </div>
        )}

        {/* Instruções */}
        {!isConfigured && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Configuração necessária:</strong> Edite o arquivo 
              <code className="bg-yellow-100 px-1 rounded mx-1">src/config/emailjs.ts</code> 
              com suas credenciais do EmailJS. Consulte o arquivo 
              <code className="bg-yellow-100 px-1 rounded mx-1">CONFIGURACAO_EMAILJS.md</code> 
              para instruções detalhadas.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}