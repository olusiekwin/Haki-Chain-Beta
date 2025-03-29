import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Switch } from "../../components/ui/Switch"
import { Label } from "../../components/ui/Label"
import { useFeatures } from "../../hooks/useFeatures"

const SettingsPage: React.FC = () => {
  const { isBlockchainEnabled, isAiAssistantEnabled } = useFeatures()

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <div className="flex items-center space-x-2">
                <Switch id="email-notifications" defaultChecked />
                <Label htmlFor="email-notifications">Receive email notifications</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <div className="flex items-center space-x-2">
                <Switch id="two-factor" />
                <Label htmlFor="two-factor">Enable two-factor authentication</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feature Settings</CardTitle>
            <CardDescription>Manage feature settings and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="blockchain">Blockchain Features</Label>
              <div className="flex items-center space-x-2">
                <Switch id="blockchain" checked={isBlockchainEnabled} disabled />
                <Label htmlFor="blockchain">
                  {isBlockchainEnabled ? "Enabled" : "Disabled"} (set via environment variable)
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ai-assistant">AI Assistant</Label>
              <div className="flex items-center space-x-2">
                <Switch id="ai-assistant" checked={isAiAssistantEnabled} disabled />
                <Label htmlFor="ai-assistant">
                  {isAiAssistantEnabled ? "Enabled" : "Disabled"} (set via environment variable)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <Button variant="destructive">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SettingsPage

