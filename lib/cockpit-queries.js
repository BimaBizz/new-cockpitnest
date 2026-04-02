import { MODELS, PRO_PAGES_DEFAULT_MENU, PRO_PAGES_ENABLED } from "@/config/cockpit";
import { getItems, getSingleton, getTree } from "@/lib/cockpit";
import { fetchMenu, fetchPageByRoute, fetchRoutes } from "@/lib/pro/pages";

const asArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const asObject = (payload) => {
  if (!payload || Array.isArray(payload)) return {};
  if (payload.data && typeof payload.data === "object" && !Array.isArray(payload.data)) {
    return payload.data;
  }
  return payload;
};

const asProPage = (payload) => {
  // console.log("[asProPage] Raw payload:", JSON.stringify(payload, null, 2));
  
  if (!payload || Array.isArray(payload)) {
    // console.log("[asProPage] Payload is null/array, returning null");
    return null;
  }

  const direct = payload;
  const nestedData = payload.data && typeof payload.data === "object" && !Array.isArray(payload.data) ? payload.data : null;

  const candidates = [
    direct,
    direct?.page,
    direct?.item,
    direct?.entry,
    nestedData,
    nestedData?.page,
    nestedData?.item,
    nestedData?.entry,
  ].filter((candidate) => candidate && typeof candidate === "object" && !Array.isArray(candidate));

  // console.log("[asProPage] Candidates found:", candidates.length, candidates);

  const candidate = candidates.find(
    (candidate) =>
      Array.isArray(candidate.layout) ||
      Array.isArray(candidate.content) ||
      Array.isArray(candidate.body) ||
      typeof candidate.content === "string" ||
      typeof candidate.body === "string" ||
      typeof candidate.title === "string"
  ) || candidates[0] || null;

  // Flatten nested data if found in candidate.data
  let result = candidate;
  if (result && result.data && typeof result.data === "object" && !Array.isArray(result.data)) {
    const { data } = result;
    // Merge data properties into result at top level
    result = {
      ...result,
      ...data,
    };
  }

  // console.log("[asProPage] Final result:", JSON.stringify(result, null, 2));
  return result;
};

const addDefaultFilter = (preview, additionalFilter) => {
  if (preview) return additionalFilter || undefined;

  const publishedFilter = { _state: "published" };
  if (!additionalFilter) return publishedFilter;
  return { $and: [publishedFilter, additionalFilter] };
};

export const getSiteSettings = async ({ locale, preview = false } = {}) => {
  const response = await getSingleton(MODELS.siteSettings, {
    locale,
    preview,
    next: { tags: ["cockpit:settings"] },
  });

  return asObject(response);
};

export const getNavigation = async ({ locale, preview = false } = {}) => {
  if (PRO_PAGES_ENABLED) {
    try {
      const menu = await fetchMenu(PRO_PAGES_DEFAULT_MENU, {
        locale,
        preview,
        next: { tags: ["cockpit:menus", "cockpit:pages"] },
      });

      // Pro Pages menu structure has links array
      return asArray(menu?.links || menu?.items || menu);
    } catch {
      return [];
    }
  }

  try {
    const tree = await getTree(MODELS.menus, {
      locale,
      preview,
      next: { tags: ["cockpit:menus"] },
    });

    return asArray(tree);
  } catch {
    return [];
  }
};

export const getLatestPosts = async ({ locale, limit = 9, preview = false } = {}) => {
  const response = await getItems(MODELS.posts, {
    locale,
    limit,
    populate: 1,
    sort: { _created: -1 },
    filter: addDefaultFilter(preview),
    preview,
    next: { tags: ["cockpit:posts"] },
  });

  return asArray(response);
};

export const getAllPostSlugs = async ({ locale, preview = false } = {}) => {
  const response = await getItems(MODELS.posts, {
    locale,
    fields: { slug: 1 },
    limit: 200,
    filter: addDefaultFilter(preview),
    preview,
    next: { tags: ["cockpit:posts"] },
  });

  return asArray(response).map((item) => item.slug).filter(Boolean);
};

export const getPostBySlug = async ({ slug, locale, preview = false } = {}) => {
  if (!slug) return null;

  const response = await getItems(MODELS.posts, {
    locale,
    limit: 1,
    populate: 1,
    filter: addDefaultFilter(preview, { slug }),
    preview,
    next: { tags: ["cockpit:posts"] },
  });

  return asArray(response)[0] || null;
};

export const getPageBySlug = async ({ slug, locale, preview = false } = {}) => {
  const normalizedSlug = !slug || slug === "/" ? "home" : slug.replace(/^\/+|\/+$/g, "");

  if (PRO_PAGES_ENABLED) {
    const route = normalizedSlug === "home" ? "/" : `/${normalizedSlug}`;

    const response = await fetchPageByRoute({
      route,
      locale,
      preview,
      next: { tags: ["cockpit:pages"] },
    }).catch(() => null);

    return asProPage(response);
  }

  const response = await getItems(MODELS.pages, {
    locale,
    limit: 1,
    populate: 1,
    filter: addDefaultFilter(preview, { slug: normalizedSlug }),
    preview,
    next: { tags: ["cockpit:pages"] },
  });

  return asArray(response)[0] || null;
};

export const getAllPageSlugs = async ({ locale, preview = false } = {}) => {
  if (PRO_PAGES_ENABLED) {
    const routes = await fetchRoutes({
      locale,
      preview,
      next: { tags: ["cockpit:pages"] },
    }).catch(() => []);

    return asArray(routes)
      .map((entry) => entry.slug || entry.route || entry.path)
      .filter(Boolean)
      .map((value) => {
        const normalized = String(value).replace(/^\/+|\/+$/g, "");
        if (!normalized) return "home";

        if (locale && normalized.startsWith(`${locale}/`)) {
          return normalized.slice(locale.length + 1) || "home";
        }

        return normalized;
      });
  }

  const response = await getItems(MODELS.pages, {
    locale,
    limit: 300,
    fields: { slug: 1 },
    filter: addDefaultFilter(preview),
    preview,
    next: { tags: ["cockpit:pages"] },
  });

  return asArray(response).map((page) => page.slug).filter(Boolean);
};
