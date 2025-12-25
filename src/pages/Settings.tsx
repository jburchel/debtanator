import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth-store'
import { useHouseholdStore } from '@/stores/household-store'
import { useHouseholdMembers, useInviteMember, useRemoveMember } from '@/hooks/use-household-members'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { LanguageSelector } from '@/components/settings/LanguageSelector'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, UserPlus, Trash2, Clock, Check, LogOut } from 'lucide-react'

export function Settings() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { household } = useHouseholdStore()
  const { data: members, isLoading } = useHouseholdMembers()
  const inviteMember = useInviteMember()
  const removeMember = useRemoveMember()

  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setInviteError(null)

    try {
      await inviteMember.mutateAsync(inviteEmail)
      setInviteEmail('')
      setInviteOpen(false)
    } catch (error) {
      setInviteError(error instanceof Error ? error.message : 'Failed to send invite')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const isOwner = household?.owner_id === user?.id

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Email</Label>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.theme')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.themeDescription')}</p>
              </div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>{t('settings.language')}</Label>
                <p className="text-sm text-muted-foreground">{t('settings.languageDescription')}</p>
              </div>
              <LanguageSelector />
            </div>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Household Members</CardTitle>
                <CardDescription>
                  {household?.name} • {members?.length ?? 0} member(s)
                </CardDescription>
              </div>
              {isOwner && (
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Invite
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleInvite}>
                      <DialogHeader>
                        <DialogTitle>Invite Family Member</DialogTitle>
                        <DialogDescription>
                          Send an invitation to join your household budget.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          placeholder="family@example.com"
                          className="mt-2"
                          required
                        />
                        {inviteError && (
                          <p className="text-sm text-destructive mt-2">{inviteError}</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setInviteOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={inviteMember.isPending}>
                          {inviteMember.isPending ? 'Sending...' : 'Send Invite'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading members...</p>
            ) : (
              <div className="space-y-3">
                {/* Owner (not in members list) */}
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {user?.email?.[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium">{user?.email}</p>
                      <p className="text-sm text-muted-foreground">Owner</p>
                    </div>
                  </div>
                </div>

                {members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-medium">
                        {member.invited_email?.[0].toUpperCase() ?? '?'}
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.invited_email ?? 'Unknown'}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {member.status === 'pending' ? (
                            <>
                              <Clock className="h-3 w-3" /> Pending invite
                            </>
                          ) : (
                            <>
                              <Check className="h-3 w-3" /> {member.role}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                    {isOwner && member.user_id !== user?.id && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => removeMember.mutate(member.id)}
                        disabled={removeMember.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
