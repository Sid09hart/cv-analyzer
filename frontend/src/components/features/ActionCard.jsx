"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ActionCard({ title, type, description, icon: Icon }) {
  const typeStyles = {
    gap: "bg-red-500/10 text-red-500 border-red-500/20",
    optimize: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    strength: "bg-green-500/10 text-green-500 border-green-500/20",
  };

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
      <Card className="h-full border-muted/50 shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </div>
          <Badge variant="outline" className={typeStyles[type] || "bg-secondary"}>
            {type.toUpperCase()}
          </Badge>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}