import Image from "next/image";

async function getPost(slug) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const data = await res.json();
  return data;
}

// Helper to render rich text annotations (bold, italic, links, code, etc.)
function renderRichText(richText) {
  if (!richText) return null;
  return richText.map((textObj, index) => {
    const { annotations, text, href } = textObj;
    if (!text) return null;
    let element = text.content;

    if (annotations.bold) {
      element = <strong key={index}>{element}</strong>;
    }
    if (annotations.italic) {
      element = <em key={index}>{element}</em>;
    }
    if (annotations.strikethrough) {
      element = <del key={index}>{element}</del>;
    }
    if (annotations.underline) {
      element = <u key={index}>{element}</u>;
    }
    if (annotations.code) {
      element = (
        <code key={index} className="bg-gray-100 dark:bg-gray-800 text-red-500 dark:text-red-400 px-1 py-0.5 rounded text-sm font-mono">
          {element}
        </code>
      );
    }
    if (href) {
      element = (
        <a key={index} href={href} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
          {element}
        </a>
      );
    }
    
    return <span key={index}>{element}</span>;
  });
}

// Recursive React component to render Notion block types
const NotionBlock = ({ block }) => {
  if (!block || !block.type) return null;
  const { type } = block;
  const data = block[type];

  const renderChildren = () => {
    if (!block.children || block.children.length === 0) return null;
    return (
      <div className="ml-6 mt-2">
        {block.children.map((child) => (
          <NotionBlock key={child.id} block={child} />
        ))}
      </div>
    );
  };

  switch (type) {
    case "bulleted_list":
      return (
        <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-800 dark:text-gray-200">
          {block.children.map((child) => (
            <NotionBlock key={child.id} block={child} />
          ))}
        </ul>
      );
    case "numbered_list":
      return (
        <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-800 dark:text-gray-200">
          {block.children.map((child) => (
            <NotionBlock key={child.id} block={child} />
          ))}
        </ol>
      );
    case "bulleted_list_item":
    case "numbered_list_item":
      return (
        <li>
          {renderRichText(data.rich_text)}
          {renderChildren()}
        </li>
      );
    case "paragraph":
      return (
        <p className="mb-4 text-gray-800 dark:text-gray-200 leading-relaxed">
          {renderRichText(data.rich_text)}
          {renderChildren()}
        </p>
      );
    case "heading_1":
      return (
        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">
          {renderRichText(data.rich_text)}
        </h1>
      );
    case "heading_2":
      return (
        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white">
          {renderRichText(data.rich_text)}
        </h2>
      );
    case "heading_3":
      return (
        <h3 className="text-xl font-medium mt-4 mb-2 text-gray-900 dark:text-white">
          {renderRichText(data.rich_text)}
        </h3>
      );
    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
          {renderRichText(data.rich_text)}
          {renderChildren()}
        </blockquote>
      );
    case "code":
      const language = data.language || "";
      const codeText = data.rich_text ? data.rich_text.map(t => t.plain_text).join("") : "";
      return (
        <pre className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto font-mono text-sm border border-gray-100 dark:border-gray-800 my-4 text-gray-800 dark:text-gray-200">
          <code className={language ? `language-${language}` : ""}>
            {codeText}
          </code>
        </pre>
      );
    case "image":
      const imageUrl = data.type === "file" ? data.file.url : data.external.url;
      const caption = data.caption ? data.caption.map(t => t.plain_text).join("") : "";
      return (
        <figure className="my-6">
          <div className="relative w-full h-96 max-h-[500px]">
            {/* Using a standard HTML img for direct external source rendering without domain-listing restrictions */}
            <img
              src={imageUrl}
              alt={caption || "Notion Image"}
              className="rounded-lg object-contain w-full h-full"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    case "divider":
      return <hr className="my-6 border-t border-gray-200 dark:border-gray-800" />;
    case "table":
      const hasHeader = data.has_column_header;
      const rows = block.children || [];
      const headerRow = hasHeader ? rows[0] : null;
      const bodyRows = hasHeader ? rows.slice(1) : rows;

      return (
        <div className="overflow-x-auto my-6 border border-gray-200 dark:border-gray-800 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            {headerRow && (
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {headerRow.table_row.cells.map((cell, idx) => (
                    <th key={idx} className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      {renderRichText(cell)}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800">
              {bodyRows.map((rowBlock) => {
                if (rowBlock.type !== "table_row") return null;
                const cells = rowBlock.table_row.cells;
                return (
                  <tr key={rowBlock.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                    {cells.map((cell, idx) => (
                      <td key={idx} className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200">
                        {renderRichText(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
};

// Group adjacent list items into a single bulleted_list or numbered_list wrapper
function groupBlocks(blocks) {
  if (!blocks) return [];
  const grouped = [];
  let currentList = null;

  for (const block of blocks) {
    if (block.type === "bulleted_list_item") {
      if (currentList && currentList.type === "bulleted_list") {
        currentList.children.push(block);
      } else {
        currentList = {
          id: `list-${block.id}`,
          type: "bulleted_list",
          children: [block],
        };
        grouped.push(currentList);
      }
    } else if (block.type === "numbered_list_item") {
      if (currentList && currentList.type === "numbered_list") {
        currentList.children.push(block);
      } else {
        currentList = {
          id: `list-${block.id}`,
          type: "numbered_list",
          children: [block],
        };
        grouped.push(currentList);
      }
    } else {
      currentList = null;
      if (block.children) {
        block.children = groupBlocks(block.children);
      }
      grouped.push(block);
    }
  }
  return grouped;
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  const groupedContent = groupBlocks(post.content);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      {post.cover && (
        <div className="relative h-96 mb-8">
          <Image
            src={post.cover || '/town-crier.webp'}
            alt={post.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      )}
      <div className="max-w-none">
        {groupedContent.map((block) => (
          <NotionBlock key={block.id} block={block} />
        ))}
      </div>
    </div>
  );
}