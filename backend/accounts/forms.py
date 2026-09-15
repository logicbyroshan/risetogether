# accounts/forms.py

from django import forms
from .models import User, Profile, ProfileLink
from django.forms import modelformset_factory

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']
        widgets = {
            'first_name': forms.TextInput(attrs={'class': 'form-field', 'placeholder': 'Your First Name'}),
            'last_name': forms.TextInput(attrs={'class': 'form-field', 'placeholder': 'Your Last Name'}),
            'email': forms.EmailInput(attrs={'class': 'form-field', 'placeholder': 'your.email@example.com'}),
        }

class ProfileUpdateForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ['profile_pic', 'bio']
        widgets = {
            'bio': forms.Textarea(attrs={'class': 'form-field', 'rows': 4, 'placeholder': 'Tell us about yourself...'}),
        }

# Create a formset for ProfileLink model
# extra=1 allows one extra empty form to be displayed for adding a new link
# can_delete=True adds a checkbox to each form to mark it for deletion
ProfileLinkFormSet = modelformset_factory(
    ProfileLink,
    fields=('title', 'url'),
    extra=1,
    can_delete=True,
    widgets={
        'title': forms.TextInput(attrs={'class': 'form-field', 'placeholder': 'e.g., GitHub'}),
        'url': forms.URLInput(attrs={'class': 'form-field', 'placeholder': 'https://github.com/username'}),
    }
)