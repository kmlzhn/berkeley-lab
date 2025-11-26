'use client';

import { ComponentData } from '@/types/components';
import { motion } from 'framer-motion';

// Import individual component renderers
import ChartComponent from './dynamic/ChartComponent';
import TableComponent from './dynamic/TableComponent';
import MatrixComponent from './dynamic/MatrixComponent';
import CardComponent from './dynamic/CardComponent';
import TimelineComponent from './dynamic/TimelineComponent';

interface DynamicComponentProps {
  data: ComponentData;
}

export default function DynamicComponent({ data }: DynamicComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="my-6"
    >
      {data.type === 'chart' && <ChartComponent data={data} />}
      {data.type === 'table' && <TableComponent data={data} />}
      {data.type === 'matrix' && <MatrixComponent data={data} />}
      {data.type === 'card' && <CardComponent data={data} />}
      {data.type === 'timeline' && <TimelineComponent data={data} />}
    </motion.div>
  );
}
