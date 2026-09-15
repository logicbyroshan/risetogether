# Component Library Specification

This document details all reusable UI primitives and domain components in the RiseTogether component library.

---

## 1. UI Primitives (`frontend/src/components/ui/`)

### `Button`
Standard interactive button with semantic variants, sizes, and loading state.
- **Props**:
  - `variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'` (default: `'primary'`)
  - `size?: 'sm' | 'md' | 'lg'` (default: `'md'`)
  - `isLoading?: boolean` (shows animated spinner, disables button)
  - `leftIcon?: ReactNode`, `rightIcon?: ReactNode`
  - `fullWidth?: boolean`
- **Usage**:
  ```tsx
  <Button variant="primary" size="md" isLoading={isSubmitting} leftIcon={<Send className="w-4 h-4" />}>
    Submit Post
  </Button>
  ```

### `Input`
Stylized text input supporting labels, errors, helper text, and icons.
- **Props**:
  - `label?: string`
  - `error?: string`
  - `helperText?: string`
  - `leftIcon?: ReactNode`, `rightIcon?: ReactNode`
  - All standard `HTMLInputElement` props.
- **Usage**:
  ```tsx
  <Input label="Email Address" type="email" placeholder="you@domain.com" error={errors.email} />
  ```

### `SearchBar`
Controlled search input with debounced query submission and clear trigger.
- **Props**:
  - `value: string`, `onChange: (val: string) => void`
  - `onSearch?: (val: string) => void`
  - `placeholder?: string`
  - `size?: 'sm' | 'md' | 'lg'`
- **Usage**:
  ```tsx
  <SearchBar value={query} onChange={setQuery} onSearch={handleSearch} placeholder="Search posts and tags..." />
  ```

### `Dropdown`
Accessible menu supporting trigger button, option items, and outside-click dismissal.
- **Props**:
  - `trigger: ReactNode`
  - `align?: 'left' | 'right'`
  - `children: ReactNode`
- **Usage**:
  ```tsx
  <Dropdown trigger={<Button variant="ghost"><MoreVertical className="w-4 h-4" /></Button>}>
    <DropdownItem onClick={handleEdit}>Edit</DropdownItem>
    <DropdownItem variant="danger" onClick={handleDelete}>Delete</DropdownItem>
  </Dropdown>
  ```

### `Modal`
Accessible dialog with backdrop blur, keyboard ESC dismissal, and size variants.
- **Props**:
  - `isOpen: boolean`, `onClose: () => void`
  - `title?: string`
  - `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'`
  - `children: ReactNode`
- **Usage**:
  ```tsx
  <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Create New Post" maxWidth="2xl">
    <CreatePostForm onSuccess={() => setModalOpen(false)} />
  </Modal>
  ```

### `Avatar`
User profile avatar with initials fallback and online status indicator.
- **Props**:
  - `src?: string | null`, `name?: string`
  - `size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'` (default: `'md'`)
  - `isOnline?: boolean`
- **Usage**:
  ```tsx
  <Avatar src={user.profile?.profile_pic} name={user.username} size="md" isOnline={true} />
  ```

### `Badge`
Compact status and category pill.
- **Props**:
  - `variant?: 'orange' | 'green' | 'blue' | 'yellow' | 'red' | 'gray'`
  - `size?: 'sm' | 'md'`
  - `children: ReactNode`
- **Usage**:
  ```tsx
  <Badge variant="orange">Published</Badge>
  ```

### `Card`
Glassmorphic surface container with hover glow effects.
- **Props**:
  - `hover?: boolean`
  - `className?: string`
  - `children: ReactNode`
- **Usage**:
  ```tsx
  <Card hover={true}>
    <CardContent />
  </Card>
  ```

### `LoadingState`, `EmptyState`, `ErrorState`
Standardized async view state components.
- **Usage**:
  ```tsx
  {loading ? (
    <LoadingState title="Loading Feed" message="Fetching latest community discussions..." />
  ) : error ? (
    <ErrorState title="Unable to load feed" message={error} onRetry={fetchPosts} />
  ) : posts.length === 0 ? (
    <EmptyState title="No posts yet" description="Be the first to share an update with the community!" actionLabel="Create Post" onAction={openModal} />
  ) : (
    <PostList posts={posts} />
  )}
  ```

---

## 2. Domain Components

| Component | Path | Responsibility |
|---|---|---|
| `PostCard` | `components/feed/PostCard.tsx` | Renders timeline post with author info, rich media, like toggle, bookmark, and comment toggle. |
| `CommentSection` | `components/feed/CommentSection.tsx` | Renders threaded comments, nested replies, comment likes, and author delete actions. |
| `CreatePostModal` | `components/feed/CreatePostModal.tsx` | Drag-and-drop media upload, tag selector, post type switcher (Normal/Blog/Project). |
| `BlogCard` | `components/community/BlogCard.tsx` | Article preview with category pill, reading time, excerpt, and author metadata. |
| `ProjectCard` | `components/community/ProjectCard.tsx` | Project showcase card with tech stack badges, team members, and live/repo links. |
| `ActivityCard` | `components/community/ActivityCard.tsx` | Community event card with occurrence badges and date metadata. |
| `EditProfileModal` | `components/profile/EditProfileModal.tsx` | User profile editor for avatar, bio, and social portfolio links. |
