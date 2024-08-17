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
  onChange: (url: string) => void; 
  value: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [preview, setPreview] = React.useState<string | ArrayBuffer | null>(value || "");

  const formSchema = z.object({
    image: z
      .instanceof(File)
      .refine((file) => file.size !== 0, "Por favor, sube una imagen."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      image: new File([""], "filename"),
    },
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => {
          setPreview(reader.result);
          onChange(reader.result as string);
        };
        reader.readAsDataURL(acceptedFiles[0]);
      } catch (error) {
        setPreview(null);
        onChange("");
      }
    },
    [onChange],
  );

  const onRemove = (event: React.MouseEvent) => {
    event.stopPropagation(); 
    setPreview(null);
    onChange("");
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 1000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="image"
        render={() => (
          <FormItem>
            <FormControl>
              <div
                {...getRootProps()}
                className="relative flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-4 shadow-sm shadow-foreground w-[200px] h-[200px] bg-gray-100"
              >
                {preview && typeof preview === "string" ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={preview}
                      alt="Uploaded image"
                      className="rounded-lg object-cover"
                      fill
                    />
                    <Button
                      type="button"
                      onClick={onRemove}
                      variant="destructive"
                      className="absolute top-2 right-2"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="h-12 w-12 text-gray-400" />
                    <Input {...getInputProps()} type="file" />
                    {isDragActive ? (
                      <p className="text-sm text-gray-600">Arrastra la imagen acá.</p>
                    ) : (
                      <p className="text-sm text-gray-600">Haz click o arrastra una imagen acá.</p>
                    )}
                  </>
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
