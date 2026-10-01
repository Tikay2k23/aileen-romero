'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { MotionConfig, motion, useInView } from 'motion/react';
import { buttonVariants } from '@/components/ui/button';
import Logo from '@/components/ui/hero-01-utils/logo';
import { BrandIcon, type Brand } from '@/components/ui/brand-icons';
import { goToSection } from '@/lib/section-nav';
import { WORK_AREAS, workHref } from '@/lib/work';

interface FooterLink {
	title: string;
	href: string;
}
interface FooterLinkGroup {
	label: string;
	links: FooterLink[];
}

// The footer waits, fixed, behind the end of the page, which slides up to reveal it. Sized to its content with a
// little air (taller on phones, where the intro stacks above the link lists), and at most as tall as the screen
// so a short window still shows all of it (the content scrolls inside when it doesn't fit).
const HEIGHT = 'h-[min(600px,100svh)] md:h-[min(420px,100svh)]';

type StickyFooterProps = React.ComponentProps<'footer'>;

export function StickyFooter({ className, ...props }: StickyFooterProps) {
	const ref = useRef<HTMLElement>(null);
	// The fixed content counts as on screen from the start, so its entrance waits for the footer itself to show
	const revealed = useInView(ref, { once: true, amount: 0.3 });

	return (
		<footer
			ref={ref}
			className={cn('relative w-full', HEIGHT, className)}
			style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
			{...props}
		>
			<div className={cn('fixed bottom-0 w-full', HEIGHT)}>
				<div className="h-full overflow-y-auto">
					<div className="relative flex size-full flex-col justify-between gap-5 border-t px-4 py-8 md:px-12">
						<div
							aria-hidden
							className="pointer-events-none absolute inset-0 isolate z-0 contain-strict"
						>
							<div className="bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 left-0 h-320 w-140 -translate-y-87.5 -rotate-45 rounded-full" />
							<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 [translate:5%_-50%] -rotate-45 rounded-full" />
							<div className="bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 left-0 h-320 w-60 -translate-y-87.5 -rotate-45 rounded-full" />
						</div>
						{/* Motion eases off for visitors who ask for less of it */}
						<MotionConfig reducedMotion="user">
							{/* On phones the two link lists sit side by side under the intro */}
							<div className="relative mt-10 grid grid-cols-2 gap-8 md:flex md:flex-row xl:mt-0">
								<AnimatedContainer show={revealed} className="col-span-2 w-full max-w-sm min-w-2xs space-y-4">
									<Logo className="gap-3" />
									<p className="text-muted-foreground mt-8 text-sm md:mt-0">
										I build scalable digital systems that connect marketing, CRM, automation, AI, and customer
										workflows.
									</p>
									<div className="flex gap-2">
										{socialLinks.map((link) => {
											const external = link.href.startsWith('http');
											return (
												<a
													key={link.title}
													href={link.href}
													aria-label={link.title}
													className={cn(buttonVariants({ variant: 'outline', size: 'icon' }), 'size-8')}
													{...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
												>
													<BrandIcon brand={link.brand} className="size-4" />
												</a>
											);
										})}
									</div>
								</AnimatedContainer>
								{footerLinkGroups.map((group, index) => (
									<AnimatedContainer
										key={group.label}
										show={revealed}
										delay={0.1 + index * 0.1}
										className="w-full"
									>
										<div>
											<h3 className="text-sm uppercase">{group.label}</h3>
											<ul className="text-muted-foreground mt-4 space-y-2 text-sm md:text-xs lg:text-sm">
												{group.links.map((link) => (
													<li key={link.title}>
														<FooterLinkItem link={link} />
													</li>
												))}
											</ul>
										</div>
									</AnimatedContainer>
								))}
							</div>
						</MotionConfig>
						<div className="text-muted-foreground relative flex flex-col items-center justify-between gap-2 border-t pt-2 text-sm md:flex-row">
							{/* The year is read where the page is built, then again in the browser */}
							<p suppressHydrationWarning>© {new Date().getFullYear()} Aileen Romero. All rights reserved.</p>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

const linkClassName = 'hover:text-foreground inline-flex items-center transition-all duration-300';

// Sections of the home page jump like the header's nav links; pages open with client-side navigation
function FooterLinkItem({ link }: { link: FooterLink }) {
	if (link.href.startsWith('#')) {
		return (
			<a
				href={link.href}
				onClick={(event) => {
					event.preventDefault();
					goToSection(link.href);
				}}
				className={linkClassName}
			>
				{link.title}
			</a>
		);
	}
	return (
		<Link href={link.href} className={linkClassName}>
			{link.title}
		</Link>
	);
}

// Placeholder profile links: swap '#' for real URLs (external links open in a new tab)
const socialLinks: { title: string; brand: Brand; href: string }[] = [
	{ title: 'Facebook', brand: 'facebook', href: '#' },
	{ title: 'GitHub', brand: 'github', href: '#' },
	{ title: 'Instagram', brand: 'instagram', href: '#' },
	{ title: 'LinkedIn', brand: 'linkedin', href: '#' },
	{ title: 'X', brand: 'x', href: '#' },
	{ title: 'YouTube', brand: 'youtube', href: '#' },
];

const footerLinkGroups: FooterLinkGroup[] = [
	{
		label: 'Work',
		// The six areas of work, each opening its own page
		links: WORK_AREAS.map((area) => ({ title: area.name, href: workHref(area.slug) })),
	},
	{
		label: 'Navigate',
		// The same sections as the header's nav (components/ui/hero-01.tsx)
		links: [
			{ title: 'Home', href: '#' },
			{ title: 'About', href: '#about' },
			{ title: 'Services', href: '#services' },
			{ title: 'Work', href: '#work' },
			{ title: 'Contact', href: '#contact' },
		],
	},
];

type AnimatedContainerProps = React.ComponentProps<typeof motion.div> & {
	children?: React.ReactNode;
	// Plays the entrance once true
	show: boolean;
	delay?: number;
};

function AnimatedContainer({ show, delay = 0.1, children, ...props }: AnimatedContainerProps) {
	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: -8, opacity: 0 }}
			animate={show ? { filter: 'blur(0px)', translateY: 0, opacity: 1 } : undefined}
			transition={{ delay, duration: 0.8 }}
			{...props}
		>
			{children}
		</motion.div>
	);
}
