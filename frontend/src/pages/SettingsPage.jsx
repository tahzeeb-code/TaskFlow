import { useAuth } from '../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const SettingsPage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-taskflow-ink hidden md:block mb-6">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <p className="text-sm text-taskflow-textSecondary">Your personal account information.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            label="Full Name" 
            value={user?.name || ''} 
            disabled 
            readOnly 
          />
          <Input 
            label="Email Address" 
            value={user?.email || ''} 
            disabled 
            readOnly 
          />
          <div className="pt-4 border-t border-taskflow-border flex justify-end">
            <Button disabled>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
