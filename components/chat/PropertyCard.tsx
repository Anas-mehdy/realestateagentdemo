'use client';

import { Property } from '@/types/demo';
import { formatCurrency } from '@/lib/helpers';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const price =
    property.deal_type === 'rent'
      ? `${formatCurrency(property.price_per_month, property.currency)}/mo`
      : formatCurrency(property.price, property.currency);

  const availabilityColor =
    property.availability === 'available'
      ? 'text-emerald-600 bg-emerald-50'
      : property.availability === 'reserved'
      ? 'text-amber-600 bg-amber-50'
      : 'text-slate-500 bg-slate-100';

  return (
    <div className="mt-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 max-w-sm">
      {/* Image */}
      <div className="relative h-36 bg-slate-100 overflow-hidden">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              `https://placehold.co/400x200/e2e8f0/94a3b8?text=${encodeURIComponent(property.area)}`;
          }}
        />
        <span
          className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${availabilityColor}`}
        >
          {property.availability}
        </span>
        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-800 text-white capitalize">
          {property.deal_type === 'rent' ? 'For Rent' : 'For Sale'}
        </span>
      </div>

      {/* Details */}
      <div className="p-3">
        <h4 className="font-semibold text-slate-800 text-sm leading-tight mb-1">
          {property.title}
        </h4>
        <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.area}, {property.city}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-slate-600 mb-2">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {property.bedrooms} bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
              {property.bathrooms} bath
            </span>
          )}
          <span>{property.size_sqm} m²</span>
          {property.investment_yield_pct && (
            <span className="text-emerald-600 font-medium">
              {property.investment_yield_pct}% yield
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-blue-800 font-bold text-sm">{price}</span>
          <span className="text-xs text-slate-400">ID: {property.property_id}</span>
        </div>
      </div>
    </div>
  );
}
