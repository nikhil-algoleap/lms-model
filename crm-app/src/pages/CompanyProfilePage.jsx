import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Edit3,
  Users,
  Building,
  Building2,
  Briefcase,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Star,
  GitBranch,
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, TextArea } from '../components/ui/Input';

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
  </svg>
);

const SectionHeader = ({ icon: Icon, eyebrow, title, action }) => (
  <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
    <div className="flex items-start gap-3">
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-blue-700">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold text-slate-900">{title}</h3>
      </div>
    </div>
    {action}
  </div>
);

const MetricTile = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-white/15 bg-white/10 p-4 shadow-sm backdrop-blur-sm">
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white">
      <Icon className="h-4 w-4" />
    </div>
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100">{label}</p>
    <p className="mt-1 truncate text-lg font-bold text-white">{value || 'Not set'}</p>
  </div>
);

const DetailRow = ({ icon: Icon, label, value, href }) => (
  <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
    <div className="mt-0.5 rounded-lg bg-white p-2 text-slate-500 shadow-sm">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer" className="mt-1 flex items-center gap-1 truncate text-sm font-semibold text-blue-700 hover:underline">
          {value}
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
        </a>
      ) : (
        <p className="mt-1 truncate text-sm font-semibold text-slate-800">{value || 'Not available'}</p>
      )}
    </div>
  </div>
);

const SocialLinkCard = ({ label, url, icon: Icon, tone }) => (
  <a
    href={url || '#'}
    target={url ? '_blank' : undefined}
    rel="noreferrer"
    className={`group flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${url ? 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md' : 'pointer-events-none border-slate-200 bg-slate-50 opacity-50'
      }`}
  >
    <div className={`rounded-lg p-2.5 ${tone}`}>
      <Icon />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-bold text-slate-900">{label}</p>
      <p className="truncate text-xs text-slate-500">{url ? url.replace(/^https?:\/\//, '') : 'Not connected'}</p>
    </div>
    {url && <ExternalLink className="h-4 w-4 text-slate-300 transition-colors group-hover:text-blue-600" />}
  </a>
);

export function CompanyProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accounts, updateAccount, contacts } = useData();
  const account = accounts.find(a => String(a.id) === String(id));

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState(account || {});

  const companyContacts = account ? contacts.filter(c => c.company === account.name) : [];

  if (!account) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
          <Building2 className="h-12 w-12 text-slate-300" />
        </div>
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-black text-slate-900">Account Not Found</h2>
          <p className="font-medium text-slate-500">The account you're looking for doesn't exist or has been removed.</p>
        </div>
        <Button icon={ArrowLeft} onClick={() => navigate('/accounts')}>
          Back to Accounts
        </Button>
      </div>
    );
  }

  const specialties = account.specialties?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const websiteLabel = account.website?.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const addressMapsUrl = account.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(account.address)}`
    : null;

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateAccount(formData);
    setIsEditModalOpen(false);
  };

  const handleOpenEdit = () => {
    setFormData({ ...account });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/accounts')}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-blue-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Accounts
      </button>

      <section className="overflow-hidden rounded-2xl border border-slate-900/10 bg-slate-950 shadow-float">
        <div className="relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.32),_transparent_30%),linear-gradient(135deg,_#0f172a_0%,_#12315f_52%,_#0b1120_100%)]" />
          <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-400/10 blur-3xl" />
          <div className="relative p-6 pt-20 sm:pt-6 ">
            <div className="absolute right-6 top-6 flex flex-wrap justify-start gap-3 lg:right-8 lg:top-8">
              {account.website && (
                <a href={account.website} target="_blank" rel="noreferrer">
                  <Button variant="secondary" size="sm" className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                    <Globe className="mr-2 h-4 w-4" />
                    Visit Website
                  </Button>
                </a>
              )}
              <Button icon={Edit3} size="sm" onClick={handleOpenEdit} className="bg-white text-slate-900 hover:bg-blue-50">
                Edit Profile
              </Button>
            </div>


            <div>
              <div className="max-w-4xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-white/20 bg-white/10 text-white">{account.status}</Badge>
                  {account.industry && <Badge className="border-blue-200/30 bg-blue-400/10 text-blue-100">{account.industry}</Badge>}
                  <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-xs font-semibold text-slate-300">Enterprise account profile</span>
                </div>

                <div className="mt-5 flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-sm">
                    <Building2 className="h-8 w-8" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-3xl font-black tracking-tight text-white lg:text-4xl">{account.name}</h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
                      {account.description || 'No executive profile summary has been added for this account.'}
                    </p>
                  </div>
                </div>

                {specialties.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {specialties.map(tag => (
                      <span key={tag} className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricTile label="Relationship Coverage" value={`${companyContacts.length} contacts`} icon={Users} />
              <MetricTile label="Company Size" value={account.size} icon={Briefcase} />
              <MetricTile label="Founded" value={account.foundedYear} icon={Calendar} />
              <MetricTile label="Location" value={account.location} icon={MapPin} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card className="p-0">
            <SectionHeader icon={Building} eyebrow="Account intelligence" title="Company Overview" />
            <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
              <DetailRow icon={Briefcase} label="Industry" value={account.industry} />
              <DetailRow icon={Users} label="Company Size" value={account.size} />
              <DetailRow icon={Calendar} label="Founded Year" value={account.foundedYear} />
              <DetailRow icon={Globe} label="Website" value={websiteLabel} href={account.website} />
              <DetailRow icon={Star} label="Status" value={account.status} />
              <DetailRow icon={MapPin} label="Market Location" value={account.location} />
            </div>
          </Card>

          <Card className="p-0">
            <SectionHeader icon={MapPin} eyebrow="Territory" title="Address & Location" />
            <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[1fr_280px]">
              <div>
                <p className="text-sm leading-6 text-slate-700">{account.address || 'No address available.'}</p>
                {addressMapsUrl && (
                  <a href={addressMapsUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex">
                    <Button variant="secondary">
                      <MapPin className="mr-2 h-4 w-4 text-blue-600" />
                      Open in Maps
                    </Button>
                  </a>
                )}
              </div>
              <div className="relative flex min-h-40 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-[linear-gradient(135deg,_#e2e8f0_25%,_transparent_25%),linear-gradient(225deg,_#e2e8f0_25%,_transparent_25%),linear-gradient(45deg,_#e2e8f0_25%,_transparent_25%),linear-gradient(315deg,_#e2e8f0_25%,_#f8fafc_25%)] bg-[length:24px_24px] bg-[position:12px_0,12px_0,0_0,0_0]">
                <div className="rounded-2xl border border-white bg-white/90 p-4 text-center shadow-sm">
                  <MapPin className="mx-auto h-6 w-6 text-blue-600" />
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-500">{account.location || 'Location not set'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-6 xl:col-span-4">
          <Card className="p-0">
            <SectionHeader icon={Mail} eyebrow="Primary channel" title="Contact Center" />
            <div className="space-y-3 p-5">
              <DetailRow icon={Users} label="Primary Contact" value={account.contact} />
              <DetailRow icon={Mail} label="Email" value={account.contactEmail} href={account.contactEmail ? `mailto:${account.contactEmail}` : undefined} />
              <DetailRow icon={Phone} label="Phone" value={account.contactPhone} href={account.contactPhone ? `tel:${account.contactPhone}` : undefined} />
            </div>
          </Card>
        </aside>
      </div>

      <Card className="p-0">
        <SectionHeader
          icon={Users}
          eyebrow="Stakeholders"
          title={`Relationship Map (${companyContacts.length})`}
          action={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/team', { state: { contactData: { company: account.name } } })}
            >
              <GitBranch className="mr-1.5 h-3.5 w-3.5" />
              Org Chart
            </Button>
          }
        />
        {companyContacts.length > 0 ? (
          <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            {companyContacts.map(c => (
              <div key={c.id} className="group p-5 transition-colors hover:bg-blue-50/50">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-sm font-black text-blue-700">
                    {c.firstName?.[0]}{c.lastName?.[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-900">{c.firstName} {c.lastName}</p>
                    <p className="truncate text-xs font-medium text-slate-500">{c.jobTitle || c.email || 'Contact'}</p>
                  </div>
                </div>
                {c.email && <p className="mt-3 truncate text-xs text-slate-500">{c.email}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-sm text-slate-500">No contacts are mapped to this account yet.</div>
        )}
      </Card>

      <Card className="p-0">
        <SectionHeader icon={Globe} eyebrow="Digital presence" title="External Profiles" />
        <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4">
          <SocialLinkCard label="LinkedIn" url={account.linkedin} icon={LinkedInIcon} tone="bg-[#0A66C2]/10 text-[#0A66C2]" />
          <SocialLinkCard label="X / Twitter" url={account.twitter} icon={TwitterIcon} tone="bg-slate-100 text-slate-900" />
          <SocialLinkCard label="Instagram" url={account.instagram} icon={InstagramIcon} tone="bg-[#E1306C]/10 text-[#E1306C]" />
          <SocialLinkCard label="Website" url={account.website} icon={Globe} tone="bg-blue-50 text-blue-700" />
        </div>
      </Card>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Company Profile"
      >
        <form onSubmit={handleEditSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Industry"
              value={formData.industry || ''}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
          <TextArea
            label="Description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contact Email"
              value={formData.contactEmail || ''}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
            <Input
              label="Contact Phone"
              value={formData.contactPhone || ''}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Location"
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Input
              label="Website"
              value={formData.website || ''}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Size"
              value={formData.size || ''}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            />
            <Input
              label="Founded Year"
              value={formData.foundedYear || ''}
              onChange={(e) => setFormData({ ...formData, foundedYear: e.target.value })}
            />
          </div>
          <Input
            label="Address"
            value={formData.address || ''}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
          <Input
            label="Specialties"
            value={formData.specialties || ''}
            onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
            placeholder="e.g. Cloud Computing, AI (comma-separated)"
          />

          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500">
              <Globe className="h-4 w-4" /> Social Media
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 text-[#0A66C2]"><LinkedInIcon /></span>
                <Input
                  label="LinkedIn URL"
                  placeholder="https://linkedin.com/company/..."
                  value={formData.linkedin || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 text-slate-800"><TwitterIcon /></span>
                <Input
                  label="X (Twitter) URL"
                  placeholder="https://twitter.com/..."
                  value={formData.twitter || ''}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 text-[#E1306C]"><InstagramIcon /></span>
                <Input
                  label="Instagram URL"
                  placeholder="https://instagram.com/..."
                  value={formData.instagram || ''}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
