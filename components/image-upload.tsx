"use-client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./ui/form";
import { ImagePlus, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useDropzone } from 'react-dropzone';
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  onChange: (url: string | string[]) => void; // Permitir tanto string como string[]
  value: string | string[]; // Permitir tanto string como string[]
  maxFiles?: number; // Parametrizado para limitar el número máximo de imágenes
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value,
  maxFiles = 1, // Por defecto a 1 para una sola imagen
}) => {
  const isMultiple = maxFiles > 1;
  const [previews, setPreviews] = React.useState<(string | ArrayBuffer | null)[]>(
    Array.isArray(value) ? value : value ? [value] : []
  );

  const formSchema = z.object({
    images: z.array(
      z.instanceof(File).refine((file) => file.size !== 0, "Por favor, sube una imagen.")
    ),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      images: [],
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = [...previews];
      acceptedFiles.forEach((file) => {
        if (newPreviews.length < maxFiles) {
          const reader = new FileReader();
          reader.onload = () => {
            newPreviews.push(reader.result);
            setPreviews(newPreviews);
            if (isMultiple) {
              onChange(newPreviews as string[]);
            } else {
              onChange(newPreviews[0] as string);
            }
          };
          reader.readAsDataURL(file);
        } else {
          toast.error(`Solo puedes subir hasta ${maxFiles} imágenes.`);
        }
      });
    },
    [previews, onChange, maxFiles, isMultiple],
  );

  const onRemove = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    if (isMultiple) {
      onChange(newPreviews as string[]);
    } else {
      onChange("");
    }
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles,
      maxSize: 100000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="images"
        render={() => (
          <FormItem>
            <FormControl>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative flex flex-col items-center justify-center rounded-lg border border-foreground p-4 shadow-sm shadow-foreground w-[200px] h-[200px] bg-gray-100"
                  >
                    {preview && typeof preview === "string" ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={preview}
                          alt={`Uploaded image ${index + 1}`}
                          className="rounded-lg object-cover"
                          fill
                        />
                        <Button
                          type="button"
                          onClick={() => onRemove(index)}
                          variant="destructive"
                          className="absolute top-2 right-2"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ))}
                {previews.length < maxFiles && (
                  <div
                    {...getRootProps()}
                    className="relative flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-4 shadow-sm shadow-foreground w-[200px] h-[200px] bg-gray-100"
                  >
                    <ImagePlus className="h-12 w-12 text-gray-400" />
                    <Input {...getInputProps()} type="file" />
                    {isDragActive ? (
                      <p className="text-sm text-gray-600">Arrastra la imagen acá.</p>
                    ) : (
                      <p className="text-sm text-gray-600">Haz click o arrastra una imagen acá.</p>
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage>
              {fileRejections.length !== 0 && (
                <p>
                  La imagen debe de pesar menos de 1MB y el tipo debe de ser png, jpg, o jpeg
                </p>
              )}
            </FormMessage>
          </FormItem>
        )}
      />
    </Form>
  );
};
