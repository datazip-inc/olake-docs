import React from 'react';

interface Author {
  name: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  linkedinUrl?: string;
}

interface TestimonialCardProps {
  quote: string;
  // Either pass a single author via flat props...
  name?: string;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  linkedinUrl?: string;
  // ...or pass multiple via the authors array.
  authors?: Author[];
}

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function AuthorBadge({ author }: { author: Author }) {
  return (
    <div className="flex items-center gap-4">
      {author.imageSrc ? (
        <img
          src={author.imageSrc}
          alt={author.imageAlt || author.name}
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center font-semibold text-lg">
          {getInitials(author.name)}
        </div>
      )}
      <div>
        {author.linkedinUrl ? (
          <a
            href={author.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="m-0 font-semibold text-base !text-white no-underline hover:underline"
          >
            {author.name}
          </a>
        ) : (
          <p className="m-0 font-semibold text-base">{author.name}</p>
        )}
        <p className="m-0 mt-1 text-sm opacity-90">{author.title}</p>
      </div>
    </div>
  );
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  authors,
  name,
  title,
  imageSrc,
  imageAlt,
  linkedinUrl,
}) => {
  const list: Author[] = authors ?? (name && title ? [{ name, title, imageSrc, imageAlt, linkedinUrl }] : []);

  return (
    <div className="bg-[#1e40af] rounded-xl p-8 my-6 text-white max-w-[800px] mx-auto">
      <p className="text-xl font-medium leading-relaxed mb-6">"{quote}"</p>
      <div className="flex flex-wrap items-center gap-8 mt-4">
        {list.map((author, i) => (
          <AuthorBadge key={i} author={author} />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCard;