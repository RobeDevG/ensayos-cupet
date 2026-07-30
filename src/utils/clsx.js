export default function clsx(...classes) {
  return classes.flat().filter(Boolean).join(' ');
}
