export function ReadMore({
	children,
	className,
}: { children: string; className?: string }) {
	const [isExpanded, setIsExpanded] = useState(false);

	const toggle = () => {
		setIsExpanded((prev) => !prev);
	};

	const isLong = children.length > 100;

	const shouldBeTrimmed = isLong && !isExpanded;

	const text = shouldBeTrimmed ? `${children.slice(0, 100)}...` : children;

	return (
		<div>
			<p
				className={cn(
					shouldBeTrimmed && 'line-clamp-1',
					className,
				)}
			>
				{text}
			</p>
			{isLong && (
				<button
					type="button"
					className="mt-2 text-sm text-gray-600 hover:text-gray-900 focus:outline-none"
					onClick={toggle}
				>
					{isExpanded ? 'Read Less' : 'Read More'}
				</button>
			)}
		</div>
	);
}
