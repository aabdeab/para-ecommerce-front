export default interface HeaderProps {
  className?: string;
  cartItems?: number;
  onCartClick?: () => void;
  onSearch?: (query: string) => void;
}