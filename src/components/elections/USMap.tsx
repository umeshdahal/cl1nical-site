import { useEffect, useRef, useState } from 'react';
import { geoAlbersUsa, geoPath } from 'd3-geo';
import { easeCubicOut } from 'd3-ease';
import { pointer, select } from 'd3-selection';
import 'd3-transition';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import * as topojson from 'topojson-client';
import { getTopoJSON } from '../../lib/topojson-cache';
import { MEMBERS } from '../../lib/member-data';

type Dimensions = {
  width: number;
  height: number;
};

export default function USMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const dimensionsRef = useRef<Dimensions>({ width: 0, height: 0 });
  const resizeFrameRef = useRef<number | null>(null);
  const renderVersionRef = useRef(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svgElement = svgRef.current;
    const tooltipElement = tooltipRef.current;
    if (!container || !svgElement || !tooltipElement) return;
    let activeZoomBehavior: any = null;
    let activePath: ReturnType<typeof geoPath> | null = null;
    let activeFeatures = new Map<string, GeoJSON.Feature>();
    let svgSelection: any = null;

    const createSvgNode = <K extends keyof SVGElementTagNameMap>(tagName: K) =>
      document.createElementNS('http://www.w3.org/2000/svg', tagName);

    const clearSvg = () => {
      while (svgElement.firstChild) {
        svgElement.removeChild(svgElement.firstChild);
      }
    };

    const drawPlaceholder = () => {
      const { width, height } = dimensionsRef.current;
      if (!width || !height) return;

      clearSvg();
      svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);

      const placeholder = createSvgNode('rect');
      placeholder.setAttribute('x', '0');
      placeholder.setAttribute('y', '0');
      placeholder.setAttribute('width', String(width));
      placeholder.setAttribute('height', String(height));
      placeholder.setAttribute('fill', 'rgba(26,26,46,0.06)');
      svgElement.appendChild(placeholder);
    };

    const render = async () => {
      const version = ++renderVersionRef.current;
      const { width, height } = dimensionsRef.current;
      if (!width || !height) return;

      drawPlaceholder();
      setError(null);

      try {
        const [districtsData, statesModule] = await Promise.all([getTopoJSON(), import('us-atlas/states-10m.json')]);
        if (version !== renderVersionRef.current) return;

        const districtsFeatureCollection =
          districtsData?.type === 'FeatureCollection'
            ? (districtsData as GeoJSON.FeatureCollection)
            : (topojson.feature(
                districtsData as any,
                districtsData.objects?.districts ?? districtsData.objects?.congress ?? Object.values(districtsData.objects ?? {})[0],
              ) as GeoJSON.FeatureCollection);

        const statesTopology = (statesModule.default ?? statesModule) as any;
        const stateObject = statesTopology.objects?.states ?? statesTopology.objects?.state;

        if (!districtsFeatureCollection?.features?.length || !stateObject) {
          throw new Error('district geometry unavailable');
        }

        const stateMesh = topojson.mesh(statesTopology, stateObject, (a, b) => a !== b) as GeoJSON.MultiLineString;
        const projection = geoAlbersUsa().fitSize([width, height], districtsFeatureCollection);
        const path = geoPath(projection);
        activePath = path;
        activeFeatures = new Map(
          districtsFeatureCollection.features.map((feature) => [String(feature.id ?? feature.properties?.GEOID ?? ''), feature as GeoJSON.Feature]),
        );

        clearSvg();
        svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);

        const mapRoot = createSvgNode('g');
        mapRoot.setAttribute('class', 'map-root');
        svgElement.appendChild(mapRoot);

        const districtsLayer = createSvgNode('g');
        districtsLayer.setAttribute('class', 'districts-layer');
        mapRoot.appendChild(districtsLayer);

        for (const feature of districtsFeatureCollection.features) {
          const districtPath = createSvgNode('path');
          const geoid = String(feature.id ?? feature.properties?.GEOID ?? '');
          const party = MEMBERS[geoid]?.party ?? 'I';

          districtPath.setAttribute('class', `district party-${party}`);
          districtPath.dataset.id = geoid;
          districtPath.setAttribute('d', path(feature) ?? '');
          districtsLayer.appendChild(districtPath);
        }

        const stateBordersPath = createSvgNode('path');
        stateBordersPath.setAttribute('class', 'state-borders');
        stateBordersPath.setAttribute('d', path(stateMesh) ?? '');
        mapRoot.appendChild(stateBordersPath);

        svgSelection = select(svgElement);
        const mapRootSelection = select(mapRoot);
        const stateBordersSelection = select(stateBordersPath);
        const districtSelection = mapRootSelection.selectAll<SVGPathElement, unknown>('.district');

        activeZoomBehavior = zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 8])
          .translateExtent([
            [0, 0],
            [width, height],
          ])
          .on('zoom', (event) => {
            mapRootSelection.attr('transform', event.transform.toString());
            stateBordersSelection.attr('stroke-width', String(0.6 / event.transform.k));
            districtSelection.attr('stroke-width', String(event.transform.k > 1.5 ? 0.4 / event.transform.k : 0.4));
          });

        svgSelection.call(activeZoomBehavior);
        svgSelection.on('dblclick.zoom', null);
      } catch (nextError) {
        if (version !== renderVersionRef.current) return;
        clearSvg();
        setError(nextError instanceof Error ? nextError.message : 'map failed to load');
      }
    };

    const hideHover = () => {
      svgElement.classList.remove('has-hover');
      tooltipElement.style.opacity = '0';

      const hovered = svgElement.querySelector('.district.hovered');
      if (hovered) {
        hovered.classList.remove('hovered');
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const hoveredDistrict = event.target instanceof Element ? event.target.closest('.district') : null;

      if (!(hoveredDistrict instanceof SVGPathElement)) {
        hideHover();
        return;
      }

      svgElement.classList.add('has-hover');

      svgElement.querySelectorAll('.district.hovered').forEach((element) => {
        if (element !== hoveredDistrict) {
          element.classList.remove('hovered');
        }
      });
      hoveredDistrict.classList.add('hovered');

      const memberData = MEMBERS[hoveredDistrict.dataset.id ?? ''];
      const districtLine = tooltipElement.querySelector('.tt-district');
      const memberLine = tooltipElement.querySelector('.tt-member');
      const partyLine = tooltipElement.querySelector('.tt-party');

      if (districtLine) {
        districtLine.textContent = memberData?.district ?? hoveredDistrict.dataset.id ?? '';
      }
      if (memberLine) {
        memberLine.textContent = memberData?.member ?? '';
      }
      if (partyLine) {
        partyLine.textContent = memberData?.party ?? 'I';
      }

      const [x, y] = pointer(event, container);
      tooltipElement.style.transform = `translate(${x + 14}px, ${y - 32}px)`;
      tooltipElement.style.opacity = '1';
    };

    const handleMouseLeave = () => {
      hideHover();
    };

    const handleDoubleClick = (event: MouseEvent) => {
      if (!svgSelection || !activeZoomBehavior) return;

      event.preventDefault();

      const currentTransform = zoomTransform(svgElement);
      if (currentTransform.k > 1.01) {
        svgSelection.transition().duration(500).call(activeZoomBehavior.transform, zoomIdentity);
        return;
      }

      const hoveredDistrict = event.target instanceof Element ? event.target.closest('.district') : null;
      if (!(hoveredDistrict instanceof SVGPathElement) || !activePath) return;

      const feature = activeFeatures.get(hoveredDistrict.dataset.id ?? '');
      if (!feature) return;

      const [[x0, y0], [x1, y1]] = activePath.bounds(feature);
      const dx = x1 - x0;
      const dy = y1 - y0;
      if (!Number.isFinite(dx) || !Number.isFinite(dy) || dx <= 0 || dy <= 0) return;

      const k = Math.max(1, Math.min(8, 0.9 / Math.max(dx / dimensionsRef.current.width, dy / dimensionsRef.current.height)));
      const tx = dimensionsRef.current.width / 2 - k * ((x0 + x1) / 2);
      const ty = dimensionsRef.current.height / 2 - k * ((y0 + y1) / 2);

      svgSelection
        .transition()
        .duration(600)
        .ease(easeCubicOut)
        .call(activeZoomBehavior.transform, zoomIdentity.translate(tx, ty).scale(k));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !svgSelection || !activeZoomBehavior) return;

      svgSelection.transition().duration(500).call(activeZoomBehavior.transform, zoomIdentity);
    };

    const updateDimensions = () => {
      const nextWidth = container.clientWidth;
      const nextHeight = Math.max(420, Math.round(nextWidth * 0.58));
      const current = dimensionsRef.current;

      if (current.width === nextWidth && current.height === nextHeight) return;

      dimensionsRef.current = { width: nextWidth, height: nextHeight };
      void render();
    };

    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }

      resizeFrameRef.current = requestAnimationFrame(() => {
        resizeFrameRef.current = null;
        updateDimensions();
      });
    });

    resizeObserver.observe(container);
    svgElement.addEventListener('mousemove', handleMouseMove);
    svgElement.addEventListener('mouseleave', handleMouseLeave);
    svgElement.addEventListener('dblclick', handleDoubleClick);
    window.addEventListener('keydown', handleKeyDown);
    updateDimensions();

    return () => {
      renderVersionRef.current += 1;
      resizeObserver.disconnect();
      svgElement.removeEventListener('mousemove', handleMouseMove);
      svgElement.removeEventListener('mouseleave', handleMouseLeave);
      svgElement.removeEventListener('dblclick', handleDoubleClick);
      window.removeEventListener('keydown', handleKeyDown);
      if (svgSelection) {
        svgSelection.on('.zoom', null);
      }
      if (resizeFrameRef.current !== null) {
        cancelAnimationFrame(resizeFrameRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '65%', margin: '0 auto' }}>
      <svg ref={svgRef} width="100%" height="100%">
        <style>{`
          .district {
            transition: opacity 150ms ease;
            will-change: opacity;
          }

          svg.has-hover .district {
            opacity: 0.3;
          }

          svg.has-hover .district.hovered {
            opacity: 1;
          }

          .party-D {
            fill: rgba(59, 110, 180, 0.72);
          }

          .party-R {
            fill: rgba(192, 57, 43, 0.72);
          }

          .party-I {
            fill: rgba(120, 120, 140, 0.5);
          }

          .state-borders {
            fill: none;
            stroke: rgba(255, 255, 255, 0.35);
            stroke-width: 0.6px;
            pointer-events: none;
          }
        `}</style>
      </svg>
      {error ? (
        <p
          style={{
            marginTop: '18px',
            textAlign: 'center',
            fontFamily: 'DM Mono, monospace',
            fontSize: '11px',
            color: '#c0392b',
          }}
        >
          map failed to load  {error}
        </p>
      ) : null}
      <p
        style={{
          marginTop: '20px',
          textAlign: 'center',
          fontFamily: 'DM Mono, monospace',
          fontSize: '11px',
          color: 'rgba(26,26,46,0.45)',
        }}
      >
        live house district feed  usdot / census / house clerk
      </p>
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 100ms ease',
          fontFamily: 'DM Mono, monospace',
          fontSize: '13px',
          color: '#1a1a2e',
        }}
      >
        <span className="tt-district" style={{ display: 'block' }} />
        <span className="tt-member" style={{ display: 'block' }} />
        <span className="tt-party" style={{ display: 'block' }} />
      </div>
    </div>
  );
}
