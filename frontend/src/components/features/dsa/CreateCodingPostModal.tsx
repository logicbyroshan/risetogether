import React, { useState, useEffect } from 'react';
import { dsaApi } from '../../../api/dsaApi';
import {
  CodingProblemPost,
  DifficultyLevel,
  TimeComplexityChoice,
  LanguageChoice,
} from '../../../types/dsa';
import { useToast } from '../../../context/ToastContext';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Textarea } from '../../ui/Textarea';
import { Select } from '../../ui/Select';
import { Sparkles, Code2 } from 'lucide-react';

interface CreateCodingPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingPost?: CodingProblemPost | null;
}

export const CreateCodingPostModal: React.FC<CreateCodingPostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingPost,
}) => {
  const [title, setTitle] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM');
  const [timeComplexity, setTimeComplexity] = useState<TimeComplexityChoice>('O(n)');
  const [detectedLang, setDetectedLang] = useState<LanguageChoice>('PYTHON');
  const [loading, setLoading] = useState(false);

  const { success: toastSuccess, error: toastError } = useToast();

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setCodeSnippet(editingPost.code_snippet);
      setDifficulty(editingPost.difficulty);
      setTimeComplexity(editingPost.time_complexity);
      setDetectedLang(editingPost.language);
    } else {
      setTitle('');
      setCodeSnippet('');
      setDifficulty('MEDIUM');
      setTimeComplexity('O(n)');
      setDetectedLang('PYTHON');
    }
  }, [editingPost, isOpen]);

  // Real-time language detection helper
  useEffect(() => {
    if (!codeSnippet) return;
    const cpp = ['#include', 'std::', 'cout', 'cin', 'int main', 'vector<'];
    const java = ['public class', 'System.out.println', 'import java.'];
    const ts = ['interface ', 'type ', ': string', ': number', ': boolean'];
    const js = ['const ', 'let ', 'var ', 'console.log', 'function('];
    const py = ['def ', 'import ', 'print(', 'elif ', 'self.'];

    if (cpp.some((k) => codeSnippet.includes(k))) setDetectedLang('CPP');
    else if (java.some((k) => codeSnippet.includes(k))) setDetectedLang('JAVA');
    else if (ts.some((k) => codeSnippet.includes(k))) setDetectedLang('TYPESCRIPT');
    else if (js.some((k) => codeSnippet.includes(k))) setDetectedLang('JAVASCRIPT');
    else if (py.some((k) => codeSnippet.includes(k))) setDetectedLang('PYTHON');
  }, [codeSnippet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !codeSnippet.trim()) {
      toastError('Please fill in both title and code snippet.');
      return;
    }

    try {
      setLoading(true);
      if (editingPost) {
        await dsaApi.updateCodingPost(editingPost.id, {
          title,
          code_snippet: codeSnippet,
          difficulty,
          time_complexity: timeComplexity,
          language: detectedLang,
        });
        toastSuccess('Coding problem solution updated!');
      } else {
        const created = await dsaApi.createCodingPost({
          title,
          code_snippet: codeSnippet,
          difficulty,
          time_complexity: timeComplexity,
          language: detectedLang,
        });
        toastSuccess(`Problem posted! Earned +${created.points_earned} points!`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toastError(err.customMessage || err.message || 'Failed to submit problem solution.');
    } finally {
      setLoading(false);
    }
  };

  const difficultyOptions = [
    { value: 'EASY', label: 'Easy (+2 Base Pts)' },
    { value: 'MEDIUM', label: 'Medium (+5 Base Pts)' },
    { value: 'HARD', label: 'Hard (+10 Base Pts)' },
  ];

  const complexityOptions = [
    { value: 'O(1)', label: 'O(1) - Constant (+10 Pts)' },
    { value: 'O(log n)', label: 'O(log n) - Logarithmic (+9 Pts)' },
    { value: 'O(n)', label: 'O(n) - Linear (+5 Pts)' },
    { value: 'O(n log n)', label: 'O(n log n) - Log-Linear (+6 Pts)' },
    { value: 'O(n^2)', label: 'O(n^2) - Quadratic (+7 Pts)' },
    { value: 'O(n^3)', label: 'O(n^3) - Cubic (+3 Pts)' },
    { value: 'O(2^n)', label: 'O(2^n) - Exponential (+2 Pts)' },
    { value: 'O(n!)', label: 'O(n!) - Factorial (+1 Pt)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingPost ? 'Edit Coding Problem' : 'Post Coding Solution'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Problem Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 217. Contains Duplicate (Hash Set Approach)"
          required
        />

        {/* Code Snippet with Language Detector */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Code Solution Snippet
            </label>
            <div className="flex items-center gap-1.5 text-xs text-orange-400 font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Detected: {detectedLang}</span>
            </div>
          </div>
          <textarea
            rows={7}
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            placeholder={`def containsDuplicate(nums: list[int]) -> bool:\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False`}
            required
            className="w-full p-3.5 bg-black border border-neutral-800 rounded-[3px] font-mono text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 resize-y leading-relaxed"
            data-lenis-prevent
          />
        </div>

        {/* Selectors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Difficulty"
            value={difficulty}
            options={difficultyOptions}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
          />

          <Select
            label="Time Complexity"
            value={timeComplexity}
            options={complexityOptions}
            onChange={(e) => setTimeComplexity(e.target.value as TimeComplexityChoice)}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            {editingPost ? 'Save Changes' : 'Submit Solution'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
