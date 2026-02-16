/**
 * Category-to-accent-color mapping for consistent theming across the app
 */

export const categoryColorMap: Record<string, string> = {
  All: 'bg-gradient-to-br from-primary/20 to-accent/20 text-primary',
  Entertainment: 'bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-pink-600 dark:text-pink-400',
  Technology: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400',
  Food: 'bg-gradient-to-br from-orange-500/20 to-yellow-500/20 text-orange-600 dark:text-orange-400',
  Sports: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 text-green-600 dark:text-green-400',
  Politics: 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-600 dark:text-purple-400',
  Music: 'bg-gradient-to-br from-red-500/20 to-pink-500/20 text-red-600 dark:text-red-400',
  Work: 'bg-gradient-to-br from-slate-500/20 to-blue-500/20 text-slate-600 dark:text-slate-400',
};

export const categoryBadgeVariant: Record<string, string> = {
  All: 'bg-primary/10 text-primary border-primary/20',
  Entertainment: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
  Technology: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  Food: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
  Sports: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  Politics: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  Music: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  Work: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
};

export function getCategoryColorClass(category: string): string {
  return categoryColorMap[category] || categoryColorMap.All;
}

export function getCategoryBadgeClass(category: string): string {
  return categoryBadgeVariant[category] || categoryBadgeVariant.All;
}
