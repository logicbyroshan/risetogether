import React, { useState } from 'react';
import { Plus, Trash2, Camera, Link as LinkIcon } from 'lucide-react';
import { UserDetail, ProfileLink } from '../../types/user';
import { accountsApi } from '../../api/accounts';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserDetail;
  onProfileUpdated: (updatedUser: UserDetail) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onProfileUpdated,
}) => {
  const [firstName, setFirstName] = useState(user.first_name || '');
  const [lastName, setLastName] = useState(user.last_name || '');
  const [bio, setBio] = useState(user.profile.bio || '');
  const [links, setLinks] = useState<ProfileLink[]>(
    user.profile.links.length > 0
      ? user.profile.links
      : [{ title: 'GitHub', url: '' }]
  );
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null);
  const [previewPicUrl, setPreviewPicUrl] = useState<string | null>(user.profile.profile_pic);
  const [submitting, setSubmitting] = useState(false);

  const { success, error: toastError } = useToast();

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicFile(file);
      setPreviewPicUrl(URL.createObjectURL(file));
    }
  };

  const handleAddLink = () => {
    if (links.length < 6) {
      setLinks([...links, { title: '', url: '' }]);
    }
  };

  const handleRemoveLink = (idx: number) => {
    setLinks(links.filter((_, i) => i !== idx));
  };

  const handleLinkChange = (idx: number, field: 'title' | 'url', val: string) => {
    setLinks(
      links.map((link, i) => (i === idx ? { ...link, [field]: val } : link))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('first_name', firstName);
      formData.append('last_name', lastName);
      formData.append('bio', bio);

      if (profilePicFile) {
        formData.append('profile_pic', profilePicFile);
      }

      const validLinks = links.filter((l) => l.title.trim() && l.url.trim());
      formData.append('links', JSON.stringify(validLinks));

      const res = await accountsApi.updateProfile(formData);
      success(res.message || 'Profile updated successfully!');
      onProfileUpdated(res.user);
      onClose();
    } catch (err: any) {
      toastError(err.customMessage || 'Failed to update profile.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Developer Profile" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile Picture Upload & Preview */}
        <div className="flex items-center gap-5 pb-2">
          <div className="relative group">
            <img
              src={
                previewPicUrl ||
                'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
              }
              alt="Avatar preview"
              className="w-18 h-18 rounded-[3px] object-cover border-2 border-orange-500/60 shadow-lg bg-neutral-900"
            />
            <label className="absolute inset-0 bg-black/70 rounded-[3px] flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-5 h-5 text-orange-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handlePicChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-200">Profile Picture</h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Click thumbnail to upload a custom PNG or JPG avatar.
            </p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />
          <Input
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />
        </div>

        {/* Bio */}
        <Textarea
          label="Bio / Headline"
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell the community about your technical interests, skills, or what you're building..."
        />

        {/* Social Links Formset */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-orange-400" />
              Social & Portfolio Links
            </label>
            {links.length < 6 && (
              <button
                type="button"
                onClick={handleAddLink}
                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Link
              </button>
            )}
          </div>

          <div className="space-y-2">
            {links.map((link, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={link.title}
                  onChange={(e) => handleLinkChange(idx, 'title', e.target.value)}
                  placeholder="Platform (GitHub, LinkedIn, Web)"
                  className="w-1/3 h-9 px-3 bg-black border border-neutral-800 rounded-[3px] text-xs text-gray-200 focus:outline-none focus:border-orange-500"
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => handleLinkChange(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 h-9 px-3 bg-black border border-neutral-800 rounded-[3px] text-xs text-gray-200 focus:outline-none focus:border-orange-500"
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 cursor-pointer"
                    aria-label="Remove link"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
